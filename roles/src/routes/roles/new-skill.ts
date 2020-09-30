import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError,
} from '@bsnpm/common';
import { Role, RoleDescriptionType } from '../../models/role';
import { User } from '../../models/user';
import { Skill } from '../../models/skill';

const router = express.Router();

/**
 * POST roles/:id/skills
 */
router.post(
    '/api/roles/:id/skills',
    requireAuth,
    [
        body('text')
            .optional()
            .trim()
            .isString()
            .withMessage('Skills text must be a string'),
        body('skillId')
            .optional()
            .trim()
            .isString()
            .withMessage('Skills text must be a string'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { text, skillId } = req.body;
        const userId = req.currentUser!.id;

        const user = await User.findById(userId);
        if (!user) {
            throw new NotAuthorizedError();
        }

        const role = await Role.findById(req.params.id);
        if (!role) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(userId) || String(role.createdBy) == userId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        // check for existing skill with same text
        if (
            role.skills &&
            role.skills.filter((skill) => skill.text == text).length
        ) {
            throw new BadRequestError('Skill already exists');
        }

        const skill = await Skill.findById(skillId);
        if (skill) {
            // if the user has passed an existing skill
            skill.uses++;
            await skill.save();

            role.skills?.push({
                skillId: skill.id,
                organizationId: skill.organizationId,
                text: skill.text,
                createdBy: skill.createdBy,
            });
        } else {
            // if the user has passed text to create a new skill
            const newSkill = await Skill.build({
                text,
                organizationId: user.organization.id,
                uses: 1,
                createdBy: user.id,
            });

            await newSkill.save();

            role.skills?.push({
                skillId: newSkill.id,
                text: newSkill.text,
                createdBy: newSkill.createdBy,
                organizationId: newSkill.organizationId,
            });
        }

        await role.save();

        res.status(200).send(role);
    },
);

export { router as addRoleSkillRoute };

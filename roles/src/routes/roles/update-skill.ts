import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { remove } from 'lodash/fp';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError,
} from '@bsnpm/common';
import { Role } from '../../models/role';
import { Skill } from '../../models/skill';
import { update } from 'lodash';

const router = express.Router();

/**
 * PUT roles/:roleId/skills/:skillId
 */
router.put(
    '/api/roles/:roleId/skills/:skillId',
    requireAuth,
    [
        body('text')
            .optional()
            .trim()
            .isString()
            .withMessage('Skills text must be a string'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.id;
        const roleId = req.params.roleId;
        const skillId = req.params.skillId;
        const { text } = req.body;

        const role = await Role.findById(roleId);

        if (!role) {
            throw new NotFoundError();
        }

        if (
            role.skills &&
            !role.skills.filter(
                (skill: any) => String(skill._id) === skillId,
            )[0]
        ) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(userId) || String(role.createdBy) == userId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        if (role.skills && role.skills.length) {
            const updatedSkill = role.skills.filter(
                (skill: any) => String(skill._id) === skillId,
            )[0];

            const updatedSkills = role.skills.reduce(
                (accum: any[], skill: any) => {
                    if (skill && String(skill._id) !== skillId) {
                        accum.push(skill);
                    } else {
                        accum.push({
                            skillId: skill.id,
                            text,
                            createdBy: skill.createdBy,
                            organizationId: skill.organizationId,
                        });
                    }
                    return accum;
                },
                [],
            );

            role.set({ skills: updatedSkills });
            await role.save();

            // if the original skill was created by this user or the role's owner update the original skill as well
            if (
                updatedSkill.createdBy &&
                (updatedSkill.createdBy == String(userId) ||
                    updatedSkill.createdBy == String(role.createdBy))
            ) {
                const originalSkill = await Skill.findById(
                    updatedSkill.skillId,
                );
                if (originalSkill) {
                    originalSkill.text = text;
                    await originalSkill.save();
                }
            }
        }

        res.status(200).send(role);
    },
);

export { router as updateRoleSkillRoute };

import express, { Request, Response } from 'express';
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

const router = express.Router();

/**
 * DELETE roles/:roleId/skills/:skillId
 */
router.delete(
    '/api/roles/:roleId/skills/:skillId',
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.id;
        const roleId = req.params.roleId;
        const skillId = req.params.skillId;

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
            const deletedSkill = role.skills.filter(
                (skill: any) => String(skill._id) === skillId,
            )[0];

            const updatedSkills = role.skills.reduce(
                (accum: any[], skill: any) => {
                    if (skill && String(skill._id) !== skillId) {
                        accum.push(skill);
                    }
                    return accum;
                },
                [],
            );

            role.set({ skills: updatedSkills });
            await role.save();

            if (deletedSkill.skillId) {
                const originalSkill = await Skill.findById(
                    deletedSkill.skillId,
                );
                if (originalSkill) {
                    originalSkill.uses--;
                    await originalSkill.save();
                }
            }
        }

        res.status(200).send(role);
    },
);

export { router as removeRoleSkillRoute };

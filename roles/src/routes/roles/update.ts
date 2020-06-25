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

const router = express.Router();

/**
 * PUT roles/:id
 *
 * Name is required.
 *
 * If descriptionItems or skills are provided they'll replace existing descriptionItems/skills.
 * If descriptionItems or skills are not provided they will not be updated on the role.
 *
 * In order to clear out descriptionItems or skills, pass an empty array
 */
router.put(
    '/api/roles/:id',
    requireAuth,
    [
        body('name')
            .optional()
            .isString()
            .trim()
            .not()
            .isEmpty()
            .withMessage('Role name must be provided'),
        body('questions')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Questions must be an array'),
        body('questions.*.text')
            .optional()
            .trim()
            .isString()
            .withMessage('Question text must be a string'),
        body('skills')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Skills must be an array'),
        body('skills.*.text')
            .optional()
            .trim()
            .isString()
            .withMessage('Skills text must be a string'),
        body('descriptionItems')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Description items must be an array'),
        body('descriptionItems.*.url')
            .optional()
            .isURL()
            .withMessage('Description item links must have a valid url'),
        body('descriptionItems.*.type')
            .custom((type) => Object.values(RoleDescriptionType).includes(type))
            .withMessage('Description item must have a valid type'),
        body('descriptionItems.*')
            .custom((item) => {
                return (
                    (item.type === RoleDescriptionType.Text && item.text) ||
                    (item.type === RoleDescriptionType.Link && item.url)
                );
            })
            .withMessage('Invalid description items'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, descriptionItems, skills, questions } = req.body;
        const userId = req.currentUser!.id;

        const role = await Role.findById(req.params.id);

        if (!role) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(userId) || role.createdBy == userId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        if (name) {
            role.set({ name });
        }

        if (descriptionItems) {
            role.set({ descriptionItems });
        }

        if (skills) {
            role.set({ skills });
        }

        if (questions) {
            role.set({ questions });
        }

        await role.save();

        res.status(200).send(role);
    },
);

export { router as updateRoleRouter };

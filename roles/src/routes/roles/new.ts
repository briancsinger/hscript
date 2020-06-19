import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError,
} from '@bsnpm/common';

import { Role, RoleDescriptionType } from '../../models/role';

console.log(body);

const router = express.Router();
router.post(
    '/api/roles',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Role name must be provided'),
        body('descriptionItems')
            .custom((items) => Array.isArray(items))
            .withMessage('Description items must be an array'),
        body('descriptionItems.*.url')
            .optional()
            .isURL()
            .withMessage('Description item links must have a valid url'),
        body('descriptionItems.*.type')
            .custom((type) => Object.values(RoleDescriptionType).includes(type))
            .withMessage('Description item must have a valid type'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, descriptionItems = [] } = req.body;
        const userId = req.currentUser!.id;

        // build role
        const role = Role.build({
            createdBy: userId,
            name,
            descriptionItems,
        });
        await role.save();

        // send resp
        res.status(201).send(role);
    },
);

export { router as createRoleRouter };

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError,
    NotAuthorizedError,
} from '@bsnpm/common';

import { Role, RoleDescriptionType } from '../../models/role';

const router = express.Router();
router.post(
    '/api/roles/:id/questions',
    requireAuth,
    [
        body('text')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Question text missing'),
        // might want to add a check that if a skill id is provided that
        // it actually exists on this role
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { text } = req.body;
        const userId = req.currentUser!.id;

        const role = await Role.findById(req.params.id);

        if (!role) {
            throw new NotFoundError();
        }

        if (role.createdBy !== userId) {
            throw new NotAuthorizedError();
        }

        // role.questions?.push({
        //     text,
        // });

        // send resp
        res.status(200).send(role);
    },
);

export { router as createRoleRouter };

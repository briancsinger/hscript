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

const router = express.Router();

/**
 * POST roles/:id/editors
 */
router.post(
    '/api/roles/:id/editors',
    requireAuth,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email must be valid'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const userId = req.currentUser!.id;

        const role = await Role.findById(req.params.id);

        if (!role) {
            throw new NotFoundError();
        }

        if (role.createdBy !== userId) {
            throw new NotAuthorizedError();
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new BadRequestError('User not found');
        }

        role.editors.push(user.id);
        await role.save();

        res.status(200).send(role);
    },
);

export { router as addRoleEditorRoute };

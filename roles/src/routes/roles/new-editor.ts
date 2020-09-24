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

        const hasAccess =
            role.editors.includes(userId) || String(role.createdBy) == userId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        const newEditor = await User.findOne({ email });

        if (!newEditor) {
            throw new BadRequestError('User not found');
        }
        if (role.editors.includes(newEditor.id)) {
            throw new BadRequestError(`${email} is already an editor`);
        }

        role.editors.push(newEditor.id);
        await role.save();

        res.status(200).send(role);
    },
);

export { router as addRoleEditorRoute };

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

const router = express.Router();

/**
 * DELETE roles/:id/editors/:editorId
 */
router.delete(
    '/api/roles/:id/editors/:editorId',
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.id;
        const roleId = req.params.id;
        const editorId = req.params.editorId;

        const role = await Role.findById(req.params.id);

        if (!role) {
            throw new NotFoundError();
        }

        if (role.editors.filter((eId) => eId === editorId)[0]) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(userId) || String(role.createdBy) == userId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        role.editors = remove(
            (eId: string) => String(eId) === editorId,
            role.editors,
        );

        await role.save();

        res.status(200).send(role);
    },
);

export { router as removeRoleEditorRoute };

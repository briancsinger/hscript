import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError, NotAuthorizedError } from '@bsnpm/common';

import { Role } from '../../models/role';

const router = express.Router();
router.get(
    '/api/roles/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const role = await Role.findById(req.params.id).populate('editors');
        const currentUserId = req.currentUser!.id;

        if (!role) {
            throw new NotFoundError();
        }

        const hasAccess =
            // @ts-ignore
            role.editors.some((editor) => editor.id === currentUserId) ||
            role.createdBy == currentUserId;
        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        res.send(role);
    },
);

export { router as getRoleRouter };

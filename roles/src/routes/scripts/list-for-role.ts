import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError, NotAuthorizedError } from '@bsnpm/common';

import { Script } from '../../models/script';
import { Role } from '../../models/role';

const router = express.Router();
router.get(
    '/api/roles/:roleId/scripts',
    requireAuth,
    async (req: Request, res: Response) => {
        const currentUserId = req.currentUser!.id;

        // make sure role exists first
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            throw new NotFoundError();
        }

        // Make sure the user has access to the role
        const hasAccess =
            role.editors.includes(currentUserId) ||
            role.createdBy == currentUserId;
        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        const scripts = await Script.find({
            role: req.params.roleId,
        });

        res.send(scripts);
    },
);

export { router as getScriptsForRoleRouter };

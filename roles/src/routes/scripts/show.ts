import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError, NotAuthorizedError } from '@bsnpm/common';

import { Role } from '../../models/role';
import { Script } from '../../models/script';

const router = express.Router();
router.get(
    '/api/scripts/:scriptId',
    requireAuth,
    async (req: Request, res: Response) => {
        const currentUserId = req.currentUser!.id;

        const script = await Script.findById(req.params.scriptId);
        if (!script) {
            throw new NotFoundError();
        }

        const role = await Role.findById(script.role);
        if (!role) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(currentUserId) ||
            role.createdBy == currentUserId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        res.send(script);
    },
);

export { router as getScriptRouter };

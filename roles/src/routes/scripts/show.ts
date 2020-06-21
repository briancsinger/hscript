import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError, NotAuthorizedError } from '@bsnpm/common';

import { Role } from '../../models/role';
import { Script } from '../../models/script';

const router = express.Router();
router.get(
    // NB: don't need roleId, so should we shorten this route?
    '/api/roles/:roleId/scripts/:scriptId',
    requireAuth,
    async (req: Request, res: Response) => {
        const script = await Script.findById(req.params.scriptId);

        if (!script) {
            throw new NotFoundError();
        }

        if (script.createdBy != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        res.send(script);
    },
);

export { router as getScriptRouter };

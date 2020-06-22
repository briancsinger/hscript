import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError } from '@bsnpm/common';

import { Script } from '../../models/script';
import { Role } from '../../models/role';

const router = express.Router();
router.get(
    '/api/roles/:roleId/scripts',
    requireAuth,
    async (req: Request, res: Response) => {
        // make sure role exists first
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            throw new NotFoundError();
        }

        const scripts = await Script.find({
            createdBy: req.currentUser!.id,
            role: req.params.roleId,
        });

        res.send(scripts);
    },
);

export { router as getScriptsRouter };

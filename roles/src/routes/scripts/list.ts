import express, { Request, Response } from 'express';

import { requireAuth } from '@bsnpm/common';

import { Script } from '../../models/script';

const router = express.Router();
router.get(
    '/api/roles/:id/scripts',
    requireAuth,
    async (req: Request, res: Response) => {
        const scripts = await Script.find({
            createdBy: req.currentUser!.id,
            role: req.params.id,
        });

        res.send(scripts);
    },
);

export { router as getScriptsRouter };

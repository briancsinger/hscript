import express, { Request, Response } from 'express';

import { requireAuth } from '@bsnpm/common';

import { Script } from '../../models/script';

const router = express.Router();
router.get('/api/scripts', requireAuth, async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const scripts = await Script.find({
        $or: [{ createdBy: userId }, { editors: userId }],
    });

    res.send(scripts);
});

export { router as getScriptsRouter };

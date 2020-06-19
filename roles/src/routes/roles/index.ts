import express, { Request, Response } from 'express';

import { requireAuth } from '@bsnpm/common';

import { Role } from '../../models/role';

const router = express.Router();
router.get('/api/roles', requireAuth, async (req: Request, res: Response) => {
    const roles = await Role.find({
        createdBy: req.currentUser!.id,
    });

    res.send(roles);
});

export { router as getRolesRouter };

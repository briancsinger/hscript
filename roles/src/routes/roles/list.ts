import express, { Request, Response } from 'express';

import { requireAuth } from '@bsnpm/common';

import { Role } from '../../models/role';

const router = express.Router();
router.get('/api/roles', requireAuth, async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const roles = await Role.findWithMyCreator({
        $or: [{ createdBy: userId }, { editors: userId }],
    });

    res.send(roles);
});

export { router as getRolesRouter };

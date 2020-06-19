import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError, NotAuthorizedError } from '@bsnpm/common';

import { Role } from '../../models/role';

const router = express.Router();
router.get(
    '/api/roles/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const role = await Role.findById(req.params.id);

        if (!role) {
            throw new NotFoundError();
        }

        if (role.createdBy !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        res.send(role);
    },
);

export { router as getRoleRouter };

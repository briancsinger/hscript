import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError,
    currentUser,
} from '@bsnpm/common';
import { Script } from '../../models/script';
import { Role } from '../../models/role';

const router = express.Router();

/**
 * PUT scripts/:id
 */
router.put(
    '/api/scripts/:scriptId',
    requireAuth,
    [
        body('name').optional().isString().withMessage('Name is invalid'),
        body('name')
            .optional()
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name is invalid'),
        // NB: may want to do some validation that the role is a valid object id
        body('items')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Script items must be an array'),
        body('items.*.text')
            .isString()
            .trim()
            .not()
            .isEmpty()
            .withMessage('Script item text must be a string'),
        body('items.*.skill')
            .optional()
            .trim()
            .not()
            .isEmpty()
            .withMessage('Question item skill must be a valid string'),
        body('items.*.skill')
            .optional()
            .isString()
            .withMessage('Question item skill must be a string'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, items } = req.body;
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

        if (name) {
            script.set({ name });
        }

        if (items) {
            script.set({ items });
        }

        await script.save();

        res.status(200).send(script);
    },
);

export { router as updateScriptRouter };

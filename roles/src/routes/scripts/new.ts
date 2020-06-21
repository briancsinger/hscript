import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
} from '@bsnpm/common';

import { Role } from '../../models/role';
import { Script } from '../../models/script';

const router = express.Router();
router.post(
    '/api/roles/:roleId/scripts',
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
        const userId = req.currentUser!.id;

        const role = await Role.findById(req.params.roleId);

        if (!role) {
            throw new NotFoundError();
        }

        if (role.createdBy != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        let scriptName = name;
        if (!scriptName) {
            const scriptCount = await Script.countDocuments({ role: role.id });
            scriptName = `Script #${scriptCount + 1}`;
        }

        // build script
        const script = Script.build({
            createdBy: userId,
            role: role.id,
            items,
            name: scriptName,
        });
        await script.save();

        // send resp
        res.status(201).send(script);
    },
);

export { router as createScriptRouter };

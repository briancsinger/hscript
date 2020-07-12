import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    currentUser,
} from '@bsnpm/common';

import { ScriptCreatedPublisher } from '../../events/publishers/script-created-publisher';
import { Role } from '../../models/role';
import { Script } from '../../models/script';
import { natsWrapper } from '../../nats-wrapper';

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
        const currentUserId = req.currentUser!.id;

        const role = await Role.findById(req.params.roleId);
        if (!role) {
            throw new NotFoundError();
        }

        const hasAccess =
            role.editors.includes(currentUserId) ||
            role.createdBy == currentUserId;

        if (!hasAccess) {
            throw new NotAuthorizedError();
        }

        let scriptName = name;
        if (!scriptName) {
            const scriptCount = await Script.countDocuments({ role: role.id });
            scriptName = `Script #${scriptCount + 1}`;
        }

        // build script
        const script = Script.build({
            createdBy: currentUserId,
            role: role.id,
            items,
            name: scriptName,
        });
        await script.save();

        // Publish an event
        await new ScriptCreatedPublisher(natsWrapper.client).publish({
            id: script.id,
            createdBy: script.createdBy,
            name: script.name,
            items: script.items,
            version: script.version,
            role: script.role,
        });

        // send resp
        res.status(201).send(script);
    },
);

export { router as createScriptRouter };

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError,
} from '@bsnpm/common';

import { Role, RoleDescriptionType } from '../../models/role';
import { RoleCreatedPublisher } from '../../events/role-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();
router.post(
    '/api/roles',
    requireAuth,
    [
        body('name')
            .isString()
            .trim()
            .not()
            .isEmpty()
            .withMessage('Valid name must be provided'),
        body('questions')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Questions must be an array'),
        body('skills')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Skills must be an array'),
        body('descriptionItems')
            .optional()
            .custom((items) => Array.isArray(items))
            .withMessage('Description items must be an array'),
        body('descriptionItems.*.url')
            .optional()
            .isURL()
            .withMessage('Description item links must have a valid url'),
        body('descriptionItems.*.type')
            .custom((type) => Object.values(RoleDescriptionType).includes(type))
            .withMessage('Description item must have a valid type'),
        body('descriptionItems.*')
            .custom((item) => {
                return (
                    (item.type === RoleDescriptionType.Text && item.text) ||
                    (item.type === RoleDescriptionType.Link && item.url)
                );
            })
            .withMessage('Invalid description items'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, descriptionItems, skills, questions } = req.body;
        const userId = req.currentUser!.id;

        // build role
        const role = Role.build({
            createdBy: userId,
            name,
            descriptionItems,
            skills,
            questions,
        });
        await role.save();

        // Publish an event
        await new RoleCreatedPublisher(natsWrapper.client).publish({
            id: role.id,
            createdBy: role.createdBy,
            name: role.name,
            version: role.version,
        });

        // send resp
        res.status(201).send(role);
    },
);

export { router as createRoleRouter };

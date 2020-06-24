import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@bsnpm/common';

import { User } from '../models/user';
import { Organization } from '../models/organization';
import { UserCreatedPublisher } from '../events/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
        body('name').trim().not().isEmpty().withMessage('Must provide a name'),
        validateRequest,
    ],
    async (req: Request, res: Response) => {
        const {
            email,
            name,
            organizationName = 'My Organization',
            password,
        } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        // build new org
        const organization = Organization.build({
            name: organizationName,
        });

        // build new user
        const user = User.build({ email, password, name, organization });

        // add user as org owner
        organization.owners.push(user.id);

        // save
        await organization.save();
        await user.save();

        // Publish an event
        console.log({
            id: user.id,
            email: user.email,
            name: user.name,
            organization: {
                id: organization.id,
                name: organization.name,
            },
            version: user.version,
        });
        await new UserCreatedPublisher(natsWrapper.client).publish({
            id: user.id,
            email: user.email,
            name: user.name,
            organization: {
                id: organization.id,
                name: organization.name,
            },
            version: user.version,
        });

        // generate jwt and store it on the session
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!,
        );

        // @ts-ignore
        req.session = { jwt: userJwt };

        res.status(201).send(user);
    },
);

export { router as signupRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@bsnpm/common';

import { BetaUser } from '../models/beta-user';

const router = express.Router();

router.post(
    '/api/users/beta-signup',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email must be valid'),
        validateRequest,
    ],
    async (req: Request, res: Response) => {
        const { email } = req.body;

        // Check for existing user
        const existingBetaUser = await BetaUser.findOne({ email });
        if (existingBetaUser) {
            res.status(200).send(existingBetaUser);
        }

        // build new beta user
        const betaUser = BetaUser.build({ email });
        await betaUser.save();

        res.status(201).send(betaUser);
    },
);

export { router as betaSignupRouter };

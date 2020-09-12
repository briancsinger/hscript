import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = (await jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!,
        )) as UserPayload;
        req.currentUser = payload;
    } catch (e) {
        console.error('issues verifying current user');
    }

    next();
};

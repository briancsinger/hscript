import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@bsnpm/common';

import { createRoleRouter } from './routes/roles/new';
import { getRolesRouter } from './routes/roles';
import { getRoleRouter } from './routes/roles/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    }),
);
app.use(currentUser);

app.use(createRoleRouter);
app.use(getRolesRouter);
app.use(getRoleRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

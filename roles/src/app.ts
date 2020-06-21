import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@bsnpm/common';

import { createRoleRouter } from './routes/roles/new';
import { getRolesRouter } from './routes/roles/list';
import { getRoleRouter } from './routes/roles/show';
import { updateRoleRouter } from './routes/roles/update';
import { getScriptsRouter } from './routes/scripts/list';
import { createScriptRouter } from './routes/scripts/new';

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

app.use(getScriptsRouter);
app.use(createScriptRouter);

app.use(createRoleRouter);
app.use(getRolesRouter);
app.use(getRoleRouter);
app.use(updateRoleRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

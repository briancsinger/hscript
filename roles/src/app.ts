import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@bsnpm/common';

import { createRoleRouter } from './routes/roles/new';
import { getRolesRouter } from './routes/roles/list';
import { getRoleRouter } from './routes/roles/show';
import { updateRoleRouter } from './routes/roles/update';
import { getScriptsForRoleRouter } from './routes/scripts/list-for-role';
import { getScriptsRouter } from './routes/scripts/list';
import { createScriptRouter } from './routes/scripts/new';
import { getScriptRouter } from './routes/scripts/show';
import { updateScriptRouter } from './routes/scripts/update';
import { addRoleEditorRoute } from './routes/roles/new-editor';
import { removeRoleEditorRoute } from './routes/roles/delete-editor';
import { addRoleSkillRoute } from './routes/roles/new-skill';
import { removeRoleSkillRoute } from './routes/roles/delete-skill';
import { updateRoleSkillRoute } from './routes/roles/update-skill';

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
app.use(getScriptsForRoleRouter);
app.use(getScriptRouter);
app.use(createScriptRouter);
app.use(updateScriptRouter);

app.use(createRoleRouter);
app.use(getRolesRouter);
app.use(getRoleRouter);
app.use(updateRoleRouter);
app.use(addRoleEditorRoute);
app.use(removeRoleEditorRoute);
app.use(addRoleSkillRoute);
app.use(removeRoleSkillRoute);
app.use(updateRoleSkillRoute);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

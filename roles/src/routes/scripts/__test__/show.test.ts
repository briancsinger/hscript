import request from 'supertest';
import mongoose, { mongo } from 'mongoose';

import { Script } from '../../../models/script';
import { app } from '../../../app';
import { Role } from '../../../models/role';

// HELPERS
const buildRole = async ({
    name = 'role name',
    createdBy = mongoose.Types.ObjectId().toHexString(),
    editor = mongoose.Types.ObjectId().toHexString(),
} = {}) => {
    const role = Role.build({
        name,
        createdBy,
    });
    role.editors.push(editor);
    await role.save();
    return role;
};
const buildScript = async ({
    name = 'scipt name',
    createdBy = mongoose.Types.ObjectId().toHexString(),
    role = mongoose.Types.ObjectId().toHexString(),
} = {}) => {
    const script = Script.build({
        name,
        createdBy,
        role,
    });
    await script.save();
    return script;
};

it('returns a 404 if the script is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/${mongoose.Types.ObjectId().toHexString()}/scripts/${id}`)
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns a 404 if the role is not found', async () => {
    const createdById = new mongoose.Types.ObjectId().toHexString();
    const script = await buildScript();

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns 401 if the user does not own the script', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const role = await buildRole();
    const script = await buildScript({ role: role.id });

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});

it('returns the script if the user is the role owner', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const role = await buildRole({ createdBy: mockUserId });
    const script = await buildScript({ role: role.id });

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin(mockUserId))
        .expect(200);

    expect(response.body.id).toEqual(script.id.toString());
    expect(response.body.name).toEqual(script.name);
});

it('returns the script if the user a the role editor', async () => {
    const notMyUserId = mongoose.Types.ObjectId().toHexString();
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const role = await buildRole({
        createdBy: notMyUserId,
        editor: mockUserId,
    });
    const script = await buildScript({ role: role.id });

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin(mockUserId))
        .expect(200);

    expect(response.body.id).toEqual(script.id.toString());
    expect(response.body.name).toEqual(script.name);
});

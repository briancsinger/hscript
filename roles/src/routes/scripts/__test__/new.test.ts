import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role } from '../../../models/role';
import { Script } from '../../../models/script';
import { natsWrapper } from '../../../nats-wrapper';

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

it('can only be accessed if the user is signed in', async () => {
    return await request(app).post('/api/roles/1/scripts').expect(401);
});

it('returns a 404 if the role does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .post(`/api/roles/${id}/scripts`)
        .set('Cookie', global.signin())
        .send({})
        .expect(404);
});

it('returns an error if invalid name is provided', async () => {
    const role = await buildRole();

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            name: [],
        })
        .expect(400);

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            name: '  ',
        })
        .expect(400);
});

it('returns an error if invalid items is provided', async () => {
    const role = await buildRole();

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            items: 'not an array',
        })
        .expect(400);

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            items: [{ text: [] }],
        })
        .expect(400);

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            items: [{ skill: '  ' }],
        })
        .expect(400);

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({
            items: [{ skill: [] }],
        })
        .expect(400);
});

it('returns 401 if the user does not own the role and is not an editor', async () => {
    const role = await buildRole();

    await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', global.signin())
        .send({})
        .expect(401);
});

it('creates a script with valid parameters if the user owns the role', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(myUserId);
    const role = await buildRole({ createdBy: myUserId });

    const scriptName = 'scriptName';
    const scriptItems = [{ text: 'text' }];
    const { body } = await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', cookie)
        .send({
            name: scriptName,
            items: scriptItems,
        })
        .expect(201);

    expect(body.name).toEqual(scriptName);
    expect(body.items).toEqual(scriptItems);
    expect(body.role).toEqual(String(role.id));
});

it('creates a script with valid parameters if the user is an editor on the role', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(myUserId);
    const role = await buildRole({ editor: myUserId });

    const scriptName = 'scriptName';
    const scriptItems = [{ text: 'text' }];
    const { body } = await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', cookie)
        .send({
            name: scriptName,
            items: scriptItems,
        })
        .expect(201);

    expect(body.name).toEqual(scriptName);
    expect(body.items).toEqual(scriptItems);
    expect(body.role).toEqual(String(role.id));
});

it('Publishes an event', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(myUserId);
    const role = await buildRole({ createdBy: myUserId });

    const scriptName = 'scriptName';
    const scriptItems = [{ text: 'text' }];
    const { body } = await request(app)
        .post(`/api/roles/${role.id}/scripts`)
        .set('Cookie', cookie)
        .send({
            name: scriptName,
            items: scriptItems,
        })
        .expect(201);

    // ensure natswrapper client publish was called
    expect(natsWrapper.client.publish).toBeCalled();
});

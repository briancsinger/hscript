import request from 'supertest';
import mongoose, { mongo } from 'mongoose';

import { Role } from '../../../models/role';
import { app } from '../../../app';
import { User } from '../../../models/user';

it('returns a 404 if the role is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/roles/${id}`)
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns 401 if the user does not own the role and is not an editor', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: mockUserId,
    };
    const role = Role.build(roleProps);

    await role.save();

    const response = await request(app)
        .get(`/api/roles/${role._id}`)
        .set('Cookie', global.signin())
        .expect(401);
});

it('returns the role if the role is found and the user is the owner', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: mockUserId,
    };
    const role = Role.build(roleProps);

    await role.save();

    const response = await request(app)
        .get(`/api/roles/${role._id}`)
        .set('Cookie', global.signin(mockUserId))
        .expect(200);

    expect(response.body.id).toEqual(role._id.toString());
    expect(response.body.name).toEqual(role.name);
});

it('returns the role if the role is found and the user is an editor', async () => {
    const editorUserId = mongoose.Types.ObjectId().toHexString();
    const editorUserProps = {
        name: 'editor',
        email: 'user@test.com',
        password: 'password',
        id: editorUserId,
        organization: {
            id: mongoose.Types.ObjectId().toHexString(),
            name: 'my org',
        },
    };
    const editor = User.build(editorUserProps);
    await editor.save();

    const ownerId = mongoose.Types.ObjectId().toHexString();
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: ownerId,
    };
    const role = Role.build(roleProps);
    role.editors.push(editor.id);
    await role.save();

    const response = await request(app)
        .get(`/api/roles/${role._id}`)
        .set('Cookie', global.signin(editor.id))
        .expect(200);

    expect(response.body.id).toEqual(role._id.toString());
    expect(response.body.name).toEqual(role.name);
});

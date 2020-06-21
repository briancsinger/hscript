import request from 'supertest';
import mongoose, { mongo } from 'mongoose';

import { Role } from '../../../models/role';
import { app } from '../../../app';

it('returns a 404 if the role is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/roles/${id}`)
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns 401 if the user does not own the role', async () => {
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

it('returns the role if the role is found', async () => {
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

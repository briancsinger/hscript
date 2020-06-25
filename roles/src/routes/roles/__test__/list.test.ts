import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';

// HELPER
const buildRole = async ({
    name = 'test name',
    descriptionItems = [],
    createdBy = mongoose.Types.ObjectId().toHexString(),
} = {}) => {
    const role = Role.build({
        name,
        descriptionItems,
        createdBy,
    });
    await role.save();
    return role;
};

it('can only be accessed if the user is signed in', async () => {
    return await request(app).get('/api/roles').expect(401);
});

it('returns roles created by current user', async () => {
    const notMeUserId = mongoose.Types.ObjectId().toHexString();
    const notMyRole = await buildRole({ createdBy: notMeUserId });

    const meUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: meUserId });
    const myRole2 = await buildRole({ createdBy: meUserId });
    const me = global.signin(meUserId);

    const response = await request(app)
        .get('/api/roles')
        .set('Cookie', me)
        .expect(200);

    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(myRole1.id);
    expect(response.body[1].id).toEqual(myRole2.id);
});

it('returns roles that the current user is an editor on', async () => {
    const notMeUserId = mongoose.Types.ObjectId().toHexString();
    const meUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: meUserId });
    const myRole2 = await buildRole({ createdBy: meUserId });
    const myRole3 = await buildRole({ createdBy: notMeUserId });
    myRole3.editors.push(meUserId);
    await myRole3.save();

    const cookie = global.signin(meUserId);
    const response = await request(app)
        .get('/api/roles')
        .set('Cookie', cookie)
        .expect(200);

    expect(response.body.length).toEqual(3);

    expect(response.body[0].id).toEqual(myRole1.id);
    expect(response.body[1].id).toEqual(myRole2.id);
    expect(response.body[2].id).toEqual(myRole3.id);
});

it('returns empty array if no roles exist for this user', async () => {
    const me = global.signin();
    const response = await request(app)
        .get('/api/roles')
        .set('Cookie', me)
        .expect(200);

    expect(response.body).toEqual([]);
});

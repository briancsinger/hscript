import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role } from '../../../models/role';
import { Script } from '../../../models/script';

// HELPERS
const buildRole = async ({
    name = 'role name',
    createdBy = mongoose.Types.ObjectId().toHexString(),
} = {}) => {
    const role = Role.build({
        name,
        createdBy,
    });
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

it('can only be accessed if the user is signed in', async () => {
    return await request(app).get('/api/scripts').expect(401);
});

it('Returns empty array if no scripts found', async () => {
    const response = await request(app)
        .get(`/api/scripts`)
        .set('Cookie', global.signin())
        .expect(200);
    expect(response.body).toEqual([]);
});

it('returns scripts for current user', async () => {
    const notMeUserId = mongoose.Types.ObjectId().toHexString();
    const notMyRole = await buildRole({ createdBy: notMeUserId });
    const notMyScript1 = await buildScript({
        createdBy: notMeUserId,
        role: notMyRole.id,
    });

    const meUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: meUserId });
    const myRole2 = await buildRole({ createdBy: meUserId });
    const myScript1 = await buildScript({
        createdBy: meUserId,
        role: myRole1.id,
    });
    const myScript2 = await buildScript({
        createdBy: meUserId,
        role: myRole1.id,
    });
    const myScript3 = await buildScript({
        createdBy: meUserId,
        role: myRole1.id,
    });

    const me = global.signin(meUserId);

    const response = await request(app)
        .get(`/api/scripts`)
        .set('Cookie', me)
        .expect(200);

    expect(response.body.length).toEqual(3);

    expect(response.body[0].id).toEqual(myScript1.id);
    expect(response.body[1].id).toEqual(myScript2.id);
    expect(response.body[2].id).toEqual(myScript3.id);
});

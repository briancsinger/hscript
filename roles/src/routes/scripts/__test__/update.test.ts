import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role } from '../../../models/role';
import { Script } from '../../../models/script';

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

it('can only be accessed if the user is signed in', async () => {
    return await request(app).put('/api/scripts/1').expect(401);
});

it('returns an error if invalid name is provided', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const script = await buildScript({ createdBy: myUserId });

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            name: [],
        })
        .expect(400);

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            name: '  ',
        })
        .expect(400);
});

it('returns an error if invalid items is provided', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const script = await buildScript({ createdBy: myUserId });

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            items: 'not an array',
        })
        .expect(400);

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            items: [{ text: [] }],
        })
        .expect(400);

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            items: [{ skill: '  ' }],
        })
        .expect(400);

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({
            items: [{ skill: [] }],
        })
        .expect(400);
});

it("returns 401 if the user does not own the role and isn't an editor", async () => {
    // const myUserId = mongoose.Types.ObjectId().toHexString();
    // const cookie = ;
    const role = await buildRole();
    const script = await buildScript({ role: role.id });

    await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .send({})
        .expect(401);
});

it('updates script with valid params if user owns the role', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(myUserId);
    const role = await buildRole({ createdBy: myUserId });
    const script = await buildScript({ role: role.id });

    const scriptItems = [{ text: 'text' }];
    const scriptName = 'new name';

    const { body } = await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', cookie)
        .send({
            name: scriptName,
            items: scriptItems,
        })
        .expect(200);

    expect(body.name).toEqual(scriptName);
    expect(body.items).toEqual(scriptItems);
});

it('updates script with valid params if user is editor of the role', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(myUserId);
    const role = await buildRole({ editor: myUserId });
    const script = await buildScript({ role: role.id });

    const scriptItems = [{ text: 'text' }];
    const scriptName = 'new name';

    const { body } = await request(app)
        .put(`/api/scripts/${script.id}`)
        .set('Cookie', cookie)
        .send({
            name: scriptName,
            items: scriptItems,
        })
        .expect(200);

    expect(body.name).toEqual(scriptName);
    expect(body.items).toEqual(scriptItems);
});

import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';
import { User } from '../../../models/user';

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

const buildUser = async ({
    name = 'username',
    email = 'test@email.com',
    id = mongoose.Types.ObjectId().toHexString(),
    organization = {
        id: mongoose.Types.ObjectId().toHexString(),
    },
} = {}) => {
    const user = User.build({
        name,
        email,
        id,
        organization,
    });
    await user.save();
    return user;
};

it.only('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .post(`/api/roles/${id}/editors`)
        .set('Cookie', global.signin())
        .send({
            email: 'test@test.com',
        });
    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .post(`/api/roles/${id}/editors`)
        .send({})
        .expect(401);
});

it('returns a 401 if the user does not own the role and is not an editor', async () => {
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: mongoose.Types.ObjectId().toHexString(),
    };
    let role = Role.build(roleProps);

    await role.save();
    const id = role._id.toString();

    const response = await request(app)
        .post(`/api/roles/${id}/editors`)
        .set('Cookie', global.signin())
        .send({
            email: 'test@test.co',
        })
        .expect(401);

    let roleCheck = await Role.findById(role._id);
    expect(roleCheck!.name).toEqual(role.name);
});

it('returns a 400 if the email provided is invalid', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });
    const cookie = global.signin(myUserId);

    // empty email
    await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .send({
            email: '',
        })
        .expect(400);

    // invalid email address
    await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .send({
            email: 'test@test',
        })
        .expect(400);
});

it('returns a 400 if the editor does not exist in DB yet', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });
    const cookie = global.signin(myUserId);

    // empty email
    await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .send({
            email: 'test@test.co',
        })
        .expect(400);
});

it("returns 401 if the user does not own the role and isn't an editor", async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });

    await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', global.signin())
        .send({
            email: 'test@test.co',
        })
        .expect(401);
});

it("adds the editor if everything's valid and user is owner", async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });
    const cookie = global.signin(myUserId);
    const editor = await buildUser();

    // empty email
    const response = await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .send({
            email: editor.email,
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.editors).toHaveLength(1);
    expect(String(role!.editors[0])).toEqual(editor.id);
});

it("adds the editor if everything's valid and user is an editor", async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole();
    myRole1.editors = [myUserId];
    await myRole1.save();
    const cookie = global.signin(myUserId);
    const editor = await buildUser();

    // empty email
    const response = await request(app)
        .post(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .send({
            email: editor.email,
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.editors).toHaveLength(2);
    expect(String(role!.editors[1])).toEqual(editor.id);
});

it.todo('Publishes an event');

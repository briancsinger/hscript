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

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const editorId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .delete(`/api/roles/${id}/editors/${editorId}`)
        .set({ Cookie: global.signin() });

    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const editorId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .delete(`/api/roles/${id}/editors/${editorId}`)
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
    const editorId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .delete(`/api/roles/${id}/editors/${editorId}`)
        .set('Cookie', global.signin())
        .expect(401);
});

it('returns a 404 if the editor is not found on the role and the user owns the role', async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });
    const cookie = global.signin(myUserId);
    const editorId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/roles/${myRole1.id}/editors`)
        .set('Cookie', cookie)
        .expect(404);
});

it("removes the editor if everything's valid and user is owner", async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole({ createdBy: myUserId });
    const cookie = global.signin(myUserId);
    const editor = await buildUser();
    myRole1.editors = [editor.id];
    await myRole1.save();

    const response = await request(app)
        .delete(`/api/roles/${myRole1.id}/editors/${editor.id}`)
        .set('Cookie', cookie)
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.editors).toHaveLength(0);
});

it("removes the editor if everything's valid and user is an editor", async () => {
    const myUserId = mongoose.Types.ObjectId().toHexString();
    const myRole1 = await buildRole();
    const cookie = global.signin(myUserId);
    const editor = await buildUser();
    myRole1.editors = [editor.id, myUserId];
    await myRole1.save();

    const response = await request(app)
        .delete(`/api/roles/${myRole1.id}/editors/${editor.id}`)
        .set('Cookie', cookie)
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.editors).toHaveLength(1);
    expect(String(role!.editors[0])).toEqual(myUserId);
});

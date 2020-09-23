import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';
import { User } from '../../../models/user';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app).put(`/api/roles/${id}`).send({});
    expect(response.status).not.toEqual(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/roles/${id}`)
        .send({})
        .expect(401);
});

it('returns a 401 if the user does not own the role', async () => {
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: mongoose.Types.ObjectId().toHexString(),
    };
    let role = Role.build(roleProps);

    await role.save();
    const id = role._id.toString();

    const response = await request(app)
        .put(`/api/roles/${id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'new name',
            descriptionItems: [],
        })
        .expect(401);

    let roleCheck = await Role.findById(role._id);
    expect(roleCheck!.name).toEqual(role.name);
});

it('returns a 400 if the provided name is invalid', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'name', descriptionItems: [] });

    // empty name
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            name: '  ',
            descriptionItems: [],
        })
        .expect(400);
});

it('returns a 400 if the descriptionItems are invalid', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'name', descriptionItems: [] });

    // desriptionItems not an array
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: 'blahblah',
        })
        .expect(400);

    // bad type
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                {
                    type: 'not a real type',
                    text: 'asdasdasd',
                },
            ],
        })
        .expect(400);

    // missing url
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                {
                    type: 'link',
                    text: 'asdasdasd',
                },
            ],
        })
        .expect(400);

    // invalid url
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                {
                    type: 'link',
                    url: 'alksjdlaskjd',
                },
            ],
        })
        .expect(400);

    // missing text
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                {
                    type: 'text',
                    url: 'asdasdasd',
                },
            ],
        })
        .expect(400);

    // empty string text
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                {
                    type: 'text',
                    url: '  ',
                },
            ],
        })
        .expect(400);
});

it('returns a 400 if the skills are invalid', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'name', skills: [] });

    // skills not an array
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            skills: 'blahblah',
        })
        .expect(400);

    // skills.*.text not a string
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            skills: [{ text: [] }],
        })
        .expect(400);

    // skills.*.text is empty string
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            skills: [{ text: '  ' }],
        })
        .expect(400);
});

it('returns a 400 if the questions are invalid', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'name', questions: [] });

    // questions not an array
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            questions: 'blahblah',
        })
        .expect(400);

    // questions.*.text not a string
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            questions: [{ text: [] }],
        })
        .expect(400);

    // questions.*.text is an empty string
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            questions: [{ text: ' ' }],
        })
        .expect(400);
});

it('updates the role provided valid inputs and user is owner', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'Role', descriptionItems: [] });

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
            descriptionItems: [
                { type: RoleDescriptionType.Link, url: 'https://asdasd.com' },
            ],
            skills: [{ text: 'skill1' }],
            questions: [{ text: 'question1' }],
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(newName);
    expect(role!.descriptionItems).toHaveLength(1);
    expect(role!.skills).toHaveLength(1);
    expect(role!.questions).toHaveLength(1);
});

it('updates the role provided valid inputs and user is an editor', async () => {
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

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${role.id}`)
        .set('Cookie', global.signin(editor.id))
        .send({
            name: newName,
            descriptionItems: [
                { type: RoleDescriptionType.Link, url: 'https://asdasd.com' },
            ],
            skills: [{ text: 'skill1' }],
            questions: [{ text: 'question1' }],
        })
        .expect(200);

    let updatedRole = await Role.findById(role.id);
    expect(updatedRole!.name).toEqual(newName);
    expect(updatedRole!.descriptionItems).toHaveLength(1);
    expect(updatedRole!.skills).toHaveLength(1);
    expect(updatedRole!.questions).toHaveLength(1);
});

it("if user does not provide a name it won't update existing name", async () => {
    const roleName = 'role';
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: roleName });

    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            descriptionItems: [
                { type: RoleDescriptionType.Link, url: 'https://asdasd.com' },
            ],
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(roleName);
});

it("if user does not provide skills it won't clear existing skills", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'Role', skills: [{ text: 'text' }] });

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
            descriptionItems: [
                { type: RoleDescriptionType.Link, url: 'https://asdasd.com' },
            ],
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(newName);
    expect(role!.descriptionItems).toHaveLength(1);
    expect(role!.skills).toHaveLength(1);
});

it("if user does not provide descriptionItems it won't clear existing descriptionItems", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            descriptionItems: [
                { type: RoleDescriptionType.Link, url: 'https://asdasd.com' },
            ],
        });

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(newName);
    expect(role!.descriptionItems).toHaveLength(1);
});

it("if user does not provide questions it won't clear existing descriptionItems", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({
            name: 'Role',
            questions: [{ text: 'this is a question' }],
        });

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(newName);
    expect(role!.questions).toHaveLength(1);
});

it.todo('Publishes an event');

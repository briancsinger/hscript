import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';
import { User } from '../../../models/user';
import { Skill } from '../../../models/skill';

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

const buildSkill = async ({
    text = 'skill text',
    organizationId = mongoose.Types.ObjectId().toHexString(),
    createdBy = mongoose.Types.ObjectId().toHexString(),
} = {}) => {
    const user = Skill.build({
        createdBy,
        text,
        organizationId,
        uses: 1,
    });
    await user.save();
    return user;
};

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/roles/${id}`)
        .set('Cookie', global.signin())
        .send({ name: 'Role', descriptionItems: [] });

    expect(response.status).toEqual(404);
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

it.skip('returns a 400 if the skills are invalid', async () => {
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

it('returns a 400 if the user tries to add a skill', async () => {
    const user = await buildUser();
    const skill = await buildSkill();
    const skill2 = await buildSkill();
    const myRole1 = await buildRole({ createdBy: user.id });
    myRole1.skills?.push({
        skillId: skill.id,
        organizationId: skill.organizationId,
        text: skill.text,
        createdBy: skill.createdBy,
    });
    await myRole1.save();
    const cookie = global.signin(user.id);

    const newName = 'new name';

    await request(app)
        .put(`/api/roles/${myRole1.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
            skills: [
                {
                    _id: skill2.id,
                    skillId: skill2.id,
                    organizationId: skill2.organizationId,
                    text: skill2.text,
                    createdBy: skill2.createdBy,
                },
                {
                    skillId: skill.id,
                    organizationId: skill.organizationId,
                    text: skill.text,
                    createdBy: skill.createdBy,
                },
            ],
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
            questions: [{ text: 'question1' }],
        })
        .expect(200);

    let role = await Role.findById(response.body.id);
    expect(role!.name).toEqual(newName);
    expect(role!.descriptionItems).toHaveLength(1);
    expect(role!.skills).toHaveLength(0);
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
            questions: [{ text: 'question1' }],
        })
        .expect(200);

    let updatedRole = await Role.findById(role.id);
    expect(updatedRole!.name).toEqual(newName);
    expect(updatedRole!.descriptionItems).toHaveLength(1);
    expect(updatedRole!.skills).toHaveLength(0);
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
    const user = User.build({
        name: 'name',
        email: 'test@test.com',
        id: mongoose.Types.ObjectId().toHexString(),
        organization: {
            id: mongoose.Types.ObjectId().toHexString(),
        },
    });
    await user.save();
    const cookie = global.signin(user.id);
    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'Role', skills: [{ text: 'text' }] });
    await request(app)
        .post(`/api/roles/${response.body.id}/skills`)
        .set('Cookie', cookie)
        .send({ text: 'text' });

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

it("allows user to reorder skills but doesn't allow updating them", async () => {
    const user = User.build({
        name: 'name',
        email: 'test@test.com',
        id: mongoose.Types.ObjectId().toHexString(),
        organization: {
            id: mongoose.Types.ObjectId().toHexString(),
        },
    });
    await user.save();
    const cookie = global.signin(user.id);

    const skillText1 = 'skill text 1';
    const skillText2 = 'skill text 2';

    const response = await request(app)
        .post(`/api/roles`)
        .set('Cookie', cookie)
        .send({ name: 'Role', skills: [{ text: 'text' }] });

    await request(app)
        .post(`/api/roles/${response.body.id}/skills`)
        .set('Cookie', cookie)
        .send({ text: skillText1 });
    await request(app)
        .post(`/api/roles/${response.body.id}/skills`)
        .set('Cookie', cookie)
        .send({ text: skillText2 });

    const newName = 'new name';

    let role = await Role.findById(response.body.id);
    await request(app)
        .put(`/api/roles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: newName,
            skills: [
                // @ts-ignore
                role!.skills![1],
                {
                    // @ts-ignore
                    _id: role!.skills![0]._id,
                    skillId: role!.skills![0].skillId,
                    text: 'new text',
                },
            ],
        })
        .expect(200);

    let updatedRole = await Role.findById(response.body.id);
    expect(updatedRole!.name).toEqual(newName);
    expect(updatedRole!.skills).toHaveLength(2);
    // @ts-ignore
    expect(updatedRole!.skills![0].skillId).toEqual(role!.skills![1].skillId);
    // @ts-ignore
    expect(updatedRole!.skills![1].skillId).toEqual(role!.skills![0].skillId);
    // @ts-ignore
    expect(updatedRole!.skills![1].text).toEqual(role!.skills![0].text);
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

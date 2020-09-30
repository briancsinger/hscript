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
    const user = await buildUser();

    const response = await request(app)
        .post(`/api/roles/${id}/skills`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: 'new skill',
        });
    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const user = await buildUser();

    const response = await request(app)
        .post(`/api/roles/${id}/skills`)
        .send({
            text: 'text',
        })
        .expect(401);
});

it('returns a 401 if the user does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .post(`/api/roles/${id}/skills`)
        .set({ Cookie: global.signin() })
        .send({
            text: 'text',
        })
        .expect(401);
});

it('returns a 401 if the user does not own the role and is not an editor', async () => {
    const user = await buildUser();
    const roleProps = {
        name: 'name',
        descriptionItems: [],
        createdBy: mongoose.Types.ObjectId().toHexString(),
    };
    const role = await buildRole(roleProps);
    const id = role._id.toString();

    const response = await request(app)
        .post(`/api/roles/${id}/skills`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: 'text skill',
        })
        .expect(401);

    let roleCheck = await Role.findById(role._id);
    expect(roleCheck!.name).toEqual(role.name);
});

it('returns a 400 if the skill text provided is invalid', async () => {
    const user = await buildUser();
    const myRole1 = await buildRole({ createdBy: user.id });
    const cookie = global.signin(user.id);

    // empty text
    await request(app)
        .post(`/api/roles/${myRole1.id}/skills`)
        .set('Cookie', cookie)
        .send({
            text: '',
        })
        .expect(400);

    // missing text
    await request(app)
        .post(`/api/roles/${myRole1.id}/skills`)
        .set('Cookie', cookie)
        .send({})
        .expect(400);
});

it('returns a 400 if the skill provided matches one that already exists', async () => {
    const user = await buildUser();
    const skillText = 'skill text';
    const myRole1 = await buildRole({ createdBy: user.id });
    myRole1.skills?.push({
        text: skillText,
    });
    await myRole1.save();
    const cookie = global.signin(user.id);

    // empty text
    await request(app)
        .post(`/api/roles/${myRole1.id}/skills`)
        .set('Cookie', cookie)
        .send({
            text: skillText,
        })
        .expect(400);
});

it("updates the role and returns it if everything's valid and user is owner", async () => {
    const user = await buildUser();
    const myRole1 = await buildRole({ createdBy: user.id });
    const cookie = global.signin(user.id);
    const skillText = 'skill text';

    const response = await request(app)
        .post(`/api/roles/${myRole1.id}/skills`)
        .set('Cookie', cookie)
        .send({
            text: skillText,
            organization: user.organization.id,
        })
        .expect(200);

    const skill = await Skill.findById(response.body.skills[0].skillId);
    expect(skill!.text).toEqual(skillText);

    const role = await Role.findById(myRole1.id);
    expect(role!.skills).toHaveLength(1);
    expect(role!.skills![0].text).toEqual(skillText);
    expect(role!.skills![0].createdBy).toEqual(String(user.id));

    expect(response.body.skills).toHaveLength(1);
    expect(response.body.skills[0].text).toEqual(skillText);
    expect(response.body.skills[0].createdBy).toEqual(String(user.id));
});

it("creates a new skill if everything's valid and user is owner", async () => {
    const user = await buildUser();
    const myRole1 = await buildRole({ createdBy: user.id });
    const cookie = global.signin(user.id);
    const skillText = 'skill text';

    const response = await request(app)
        .post(`/api/roles/${myRole1.id}/skills`)
        .set('Cookie', cookie)
        .send({
            text: skillText,
        })
        .expect(200);

    const skill = await Skill.findById(response.body.skills[0].skillId);
    const role = await Role.findById(myRole1.id);

    expect(skill!.text).toEqual(skillText);
    expect(String(skill!.organizationId)).toEqual(String(user.organization.id));
    expect(String(role!.skills![0].skillId)).toEqual(String(skill!.id));
    expect(String(role!.skills![0].createdBy)).toEqual(String(user.id));
});

describe('when user passes existing skill id', () => {
    it("updates skill uses and adds skill to role if everything's valid and user is owner", async () => {
        const user = await buildUser();
        const skill = await buildSkill();
        const myRole1 = await buildRole({ createdBy: user.id });
        const cookie = global.signin(user.id);

        const response = await request(app)
            .post(`/api/roles/${myRole1.id}/skills`)
            .set('Cookie', cookie)
            .send({
                text: skill.text,
                skillId: String(skill.id),
            })
            .expect(200);

        const updatedSkill = await Skill.findById(skill.id);
        const role = await Role.findById(myRole1.id);

        expect(updatedSkill!.text).toEqual(skill.text);
        expect(updatedSkill!.uses).toEqual(2);
        expect(String(updatedSkill!.organizationId)).toEqual(
            String(skill.organizationId),
        );
        expect(String(updatedSkill!.createdBy)).toEqual(
            String(skill.createdBy),
        );
        expect(String(role!.skills![0].skillId)).toEqual(
            String(updatedSkill!.id),
        );

        expect(role!.skills).toHaveLength(1);
        expect(role!.skills![0].text).toEqual(updatedSkill!.text);
        expect(role!.skills![0].skillId).toEqual(String(updatedSkill!.id));
        expect(role!.skills![0].createdBy).toEqual(
            String(updatedSkill!.createdBy),
        );
    });

    describe('and skill does not already exist', () => {
        it("creates a new skill and adds skill to role if everything's valid and user is owner", async () => {
            const user = await buildUser();
            const skillId = mongoose.Types.ObjectId().toHexString();
            const skillText = 'skill text';
            const myRole1 = await buildRole({ createdBy: user.id });
            const cookie = global.signin(user.id);

            const response = await request(app)
                .post(`/api/roles/${myRole1.id}/skills`)
                .set('Cookie', cookie)
                .send({
                    text: skillText,
                    skillId: String(skillId),
                })
                .expect(200);

            const role = await Role.findById(myRole1.id);

            expect(String(role!.skills![0].skillId)).not.toEqual(
                String(skillId),
            );

            expect(role!.skills).toHaveLength(1);
            expect(role!.skills![0].text).toEqual(skillText);
            expect(role!.skills![0].createdBy).toEqual(String(user.id));

            const newSkillId = role!.skills![0].skillId;
            const skill = await Skill.findById(newSkillId);
            expect(skill?.text).toEqual(skillText);
            expect(skill?.uses).toEqual(1);
            expect(String(skill?.createdBy)).toEqual(String(user.id));
            expect(String(skill?.organizationId)).toEqual(
                String(user.organization.id),
            );
        });
    });
});

it.todo('Publishes an event');

import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';
import { User } from '../../../models/user';
import { Skill } from '../../../models/skill';
import { update } from 'lodash';

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
    uses = 1,
} = {}) => {
    const user = Skill.build({
        createdBy,
        text,
        organizationId,
        uses,
    });
    await user.save();
    return user;
};

it('returns a 404 if the role does not exist', async () => {
    const roleId = new mongoose.Types.ObjectId().toHexString();
    const skillId = new mongoose.Types.ObjectId().toHexString();
    const user = await buildUser();

    const response = await request(app)
        .put(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: 'updatedSkillText',
        })
        .expect(404);
});

it('returns a 404 if the skill does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const user = await buildUser();
    const role = await buildRole({
        createdBy: String(user.id),
    });

    const response = await request(app)
        .put(`/api/roles/${role.id}/skills/${id}`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: 'updatedSkillText',
        })
        .expect(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const roleId = new mongoose.Types.ObjectId().toHexString();
    const skillId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/roles/${roleId}/skills/${skillId}`)
        .send({
            text: 'updatedSkillText',
        })
        .expect(401);
});

it('returns a 401 if the user does not own the role and is not an editor', async () => {
    const user = await buildUser();
    const role = await buildRole();
    const skill = await buildSkill();
    role.skills?.push(skill);
    await role.save();

    const roleId = role._id.toString();
    // @ts-ignore
    const skillId = String(role.skills[0]._id);

    const response = await request(app)
        .put(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: 'updatedSkillText',
        })
        .expect(401);

    let nonUpdatedRole = await Role.findById(role._id);
    expect(nonUpdatedRole!.skills).toHaveLength(1);
});

it('returns 400 if the text is invalid', async () => {
    const user = await buildUser();
    const role = await buildRole({
        createdBy: user.id,
    });
    const skill = await buildSkill();
    role.skills?.push({
        skillId: skill.id,
        organizationId: skill.organizationId,
        text: skill.text,
        createdBy: skill.createdBy,
    });
    await role.save();

    const roleId = role._id.toString();
    // @ts-ignore
    const skillId = String(role.skills[0]._id);
    const updatedSkillText = 'updated skill text';

    // empty string text
    await request(app)
        .put(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .send({
            text: '',
        })
        .expect(400);

    // missing text
    await request(app)
        .put(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .send({
            foo: 'bar',
        })
        .expect(400);
});

// it('updates the skill if user is owner of the role', async () => {
//     const user = await buildUser();
//     const role = await buildRole({
//         createdBy: user.id,
//     });
//     const skill = await buildSkill();
//     role.skills?.push({
//         skillId: skill.id,
//         organizationId: skill.organizationId,
//         text: skill.text,
//         createdBy: skill.createdBy,
//     });
//     await role.save();

//     const roleId = role._id.toString();
//     // @ts-ignore
//     const skillId = String(role.skills[0]._id);
//     const updatedSkillText = 'updated skill text';

//     const response = await request(app)
//         .put(`/api/roles/${roleId}/skills/${skillId}`)
//         .set('Cookie', global.signin(user.id))
//         .send({
//             text: updatedSkillText,
//         })
//         .expect(200);

//     expect(response.body.skills[0].text).toEqual(updatedSkillText);

//     const updatedRole = await Role.findById(role.id);
//     expect(updatedRole!.skills![0].text).toEqual(updatedSkillText);
// });

describe('when the user is the creator of the skill', () => {
    it('updates the original skill document', async () => {
        const user = await buildUser();
        const role = await buildRole();
        const skill = await buildSkill({ createdBy: user.id });
        role.editors.push(user.id);
        role.skills?.push({
            skillId: skill.id,
            organizationId: skill.organizationId,
            text: skill.text,
            createdBy: skill.createdBy,
        });
        await role.save();

        const roleId = role._id.toString();
        // @ts-ignore
        const skillId = String(role.skills[0]._id);
        const updatedSkillText = 'updated skill text';

        const response = await request(app)
            .put(`/api/roles/${roleId}/skills/${skillId}`)
            .set('Cookie', global.signin(user.id))
            .send({
                text: updatedSkillText,
            })
            .expect(200);

        expect(response.body.skills[0].text).toEqual(updatedSkillText);

        const updatedRole = await Role.findById(role.id);
        expect(updatedRole!.skills![0].text).toEqual(updatedSkillText);

        const nonUpdatedSkill = await Skill.findById(skill.id);
        expect(nonUpdatedSkill!.text).toEqual(updatedSkillText);
    });
});

describe('when the owner of the role is the creator of the skill', () => {
    it('updates the original skill document', async () => {
        const user = await buildUser();
        const roleOwner = await buildUser();
        const role = await buildRole({
            createdBy: roleOwner.id,
        });
        const skill = await buildSkill({
            createdBy: roleOwner.id,
        });
        role.editors.push(user.id);
        role.skills?.push({
            skillId: skill.id,
            organizationId: skill.organizationId,
            text: skill.text,
            createdBy: skill.createdBy,
        });
        await role.save();

        const roleId = role._id.toString();
        // @ts-ignore
        const skillId = String(role.skills[0]._id);
        const updatedSkillText = 'updated skill text';

        const response = await request(app)
            .put(`/api/roles/${roleId}/skills/${skillId}`)
            .set('Cookie', global.signin(user.id))
            .send({
                text: updatedSkillText,
            })
            .expect(200);

        expect(response.body.skills[0].text).toEqual(updatedSkillText);

        const updatedRole = await Role.findById(role.id);
        expect(updatedRole!.skills![0].text).toEqual(updatedSkillText);

        const nonUpdatedSkill = await Skill.findById(skill.id);
        expect(nonUpdatedSkill!.text).toEqual(updatedSkillText);
    });
});

describe('when the owner of the role is not the creator of the skill and the user is not the creator of the skill but the user can edit the role', () => {
    it('updates the role but does not update the original skill document', async () => {
        const user = await buildUser();
        const role = await buildRole({
            createdBy: user.id,
        });
        const skill = await buildSkill();
        role.skills?.push({
            skillId: skill.id,
            organizationId: skill.organizationId,
            text: skill.text,
            createdBy: skill.createdBy,
        });
        await role.save();

        const roleId = role._id.toString();
        // @ts-ignore
        const skillId = String(role.skills[0]._id);
        const updatedSkillText = 'updated skill text';

        const response = await request(app)
            .put(`/api/roles/${roleId}/skills/${skillId}`)
            .set('Cookie', global.signin(user.id))
            .send({
                text: updatedSkillText,
            })
            .expect(200);

        expect(response.body.skills[0].text).toEqual(updatedSkillText);

        const updatedRole = await Role.findById(role.id);
        expect(updatedRole!.skills![0].text).toEqual(updatedSkillText);

        const nonUpdatedSkill = await Skill.findById(skill.id);
        expect(nonUpdatedSkill!.text).toEqual(skill.text);
    });
});

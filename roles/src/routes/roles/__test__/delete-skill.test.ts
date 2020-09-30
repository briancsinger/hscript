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
        .delete(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .expect(404);
});

it('returns a 404 if the skill does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const user = await buildUser();
    const role = await buildRole({
        createdBy: String(user.id),
    });

    const response = await request(app)
        .delete(`/api/roles/${role.id}/skills/${id}`)
        .set('Cookie', global.signin(user.id))
        .expect(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const roleId = new mongoose.Types.ObjectId().toHexString();
    const skillId = new mongoose.Types.ObjectId().toHexString();
    const user = await buildUser();

    const response = await request(app)
        .delete(`/api/roles/${roleId}/skills/${skillId}`)
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
        .delete(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .expect(401);

    let nonUpdatedRole = await Role.findById(role._id);
    expect(nonUpdatedRole!.skills).toHaveLength(1);
});

it('deletes the skill if user is owner', async () => {
    const user = await buildUser();
    const role = await buildRole({
        createdBy: user.id,
    });
    const skill = await buildSkill();
    const skill2 = await buildSkill();
    role.skills?.push({
        skillId: skill.id,
        organizationId: skill.organizationId,
        text: skill.text,
        createdBy: skill.createdBy,
    });
    role.skills?.push({
        skillId: skill2.id,
        organizationId: skill2.organizationId,
        text: skill2.text,
        createdBy: skill2.createdBy,
    });
    await role.save();

    const roleId = role._id.toString();
    // @ts-ignore
    const skillId = String(role.skills[0]._id);

    const response = await request(app)
        .delete(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .expect(200);

    expect(response.body.skills).toHaveLength(1);

    const updatedRole = await Role.findById(role.id);
    expect(updatedRole!.skills).toHaveLength(1);
});

it('reduces the skill uses by 1', async () => {
    const user = await buildUser();
    const role = await buildRole({
        createdBy: user.id,
    });
    const skill = await buildSkill({
        uses: 5,
    });
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

    await request(app)
        .delete(`/api/roles/${roleId}/skills/${skillId}`)
        .set('Cookie', global.signin(user.id))
        .expect(200);

    const updatedRole = await Role.findById(role.id);
    expect(updatedRole!.skills).toHaveLength(0);

    const updatedSkill = await Skill.findById(skill.id);
    expect(updatedSkill?.uses).toEqual(4);
});

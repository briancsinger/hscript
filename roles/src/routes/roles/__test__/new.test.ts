import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';
import { natsWrapper } from '../../../nats-wrapper';
import { User } from '../../../models/user';

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post('/api/roles').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an inalid name is provided', async () => {
    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            name: '  ',
            descriptionItems: [],
        })
        .expect(400);

    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            descriptionItems: [],
        })
        .expect(400);
});

it('returns an error if invalid descriptionItems is provided', async () => {
    // desriptionItems not an array
    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            name: 'Role',
            descriptionItems: 'blahblah',
        })
        .expect(400);

    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
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
        .post('/api/roles')
        .set('Cookie', global.signin())
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
        .post('/api/roles')
        .set('Cookie', global.signin())
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
        .post('/api/roles')
        .set('Cookie', global.signin())
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
});

it('returns an error if invalid questions is provided', async () => {
    // desriptionItems not an array
    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            name: 'Role',
            questions: 'blahblah',
        })
        .expect(400);
});

it('creates a role with valid paramaters', async () => {
    const name = 'Role name';
    const descriptionItems = [
        { type: RoleDescriptionType.Link, url: 'https://google.com' },
        { type: RoleDescriptionType.Text, text: 'blah blah' },
    ];
    const questions = [{ text: 'question1' }];

    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const mockUser = User.build({
        name: 'test',
        email: 'test@test.com',
        id: mockUserId,
        organization: {
            id: '1',
            name: 'org',
        },
    });
    await mockUser.save();

    const { body } = await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin(mockUserId))
        .send({
            name,
            descriptionItems,
            questions,
        })
        .expect(201);

    const roles = await Role.find({});
    expect(roles.length).toEqual(1);

    expect(body.descriptionItems[0].type).toEqual(descriptionItems[0].type);
    expect(body.name).toEqual(name);
    expect(body.createdBy).toEqual(mockUserId);
    expect(body.skills).toHaveLength(0);
    expect(body.questions![0].text).toEqual(questions[0].text);
    expect(roles[0].descriptionItems[0].type).toEqual(descriptionItems[0].type);
    expect(roles[0].name).toEqual(name);
    expect(String(roles[0].createdBy)).toEqual(mockUserId);
    expect(roles[0].skills).toHaveLength(0);
    expect(roles[0].questions![0].text).toEqual(questions[0].text);
});

it('publishes an event', async () => {
    const { body } = await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            name: 'name',
        })
        .expect(201);

    // ensure natswrapper client publish was called
    expect(natsWrapper.client.publish).toBeCalled();
});

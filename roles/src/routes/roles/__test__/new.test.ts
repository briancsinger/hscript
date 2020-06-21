import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../app';
import { Role, RoleDescriptionType } from '../../../models/role';

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

it('returns an error if invalid skills is provided', async () => {
    // desriptionItems not an array
    await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin())
        .send({
            name: 'Role',
            skills: 'blahblah',
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
    const skills = [{ text: 'skill1' }];
    const questions = [{ text: 'question1' }];

    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const { body } = await request(app)
        .post('/api/roles')
        .set('Cookie', global.signin(mockUserId))
        .send({
            name,
            descriptionItems,
            skills,
            questions,
        })
        .expect(201);

    const roles = await Role.find({});
    expect(roles.length).toEqual(1);

    expect(body.descriptionItems[0].type).toEqual(descriptionItems[0].type);
    expect(body.name).toEqual(name);
    expect(body.createdBy).toEqual(mockUserId);
    expect(body.skills![0].text).toEqual(skills[0].text);
    expect(body.questions![0].text).toEqual(questions[0].text);
    expect(roles[0].descriptionItems[0].type).toEqual(descriptionItems[0].type);
    expect(roles[0].name).toEqual(name);
    expect(roles[0].createdBy).toEqual(mockUserId);
    expect(roles[0].skills![0].text).toEqual(skills[0].text);
    expect(roles[0].questions![0].text).toEqual(questions[0].text);
});

it.todo('Publishes an event');

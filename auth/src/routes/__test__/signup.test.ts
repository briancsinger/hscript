import request from 'supertest';
import { app } from '../../app';
import { Organization } from '../../models/organization';
import { User } from '../../models/user';

it('returns a 400 if name is missing', async () => {
    return await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('returns a 400 if password is invalid', async () => {
    return await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1',
            name: 'name',
        })
        .expect(400);
});

it('returns a 400 if email is invalid', async () => {
    return await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test.com',
            password: '123456',
            name: 'name',
        })
        .expect(400);
});

describe('when input is valid', () => {
    it('returns a 201 on successful signup', async () => {
        return await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
                name: 'test name',
            })
            .expect(201);
    });

    it('creates a new org', async () => {
        await request(app).post('/api/users/signup').send({
            email: 'test@test.com',
            password: 'password',
            name: 'test name',
        });

        const orgs = await Organization.find({}).populate('owners');
        expect(orgs).toHaveLength(1);
    });

    it('creates a new user', async () => {
        const MOCK_EMAIL = 'test@test.com';
        const MOCK_NAME = 'test name';
        const MOCK_ORG_NAME = 'test org name';

        await request(app).post('/api/users/signup').send({
            email: MOCK_EMAIL,
            password: 'password',
            name: MOCK_NAME,
            organizationName: MOCK_ORG_NAME,
        });

        const newUser = await User.findOne({ email: MOCK_EMAIL }).populate(
            'organization',
        );
        expect(newUser!.email).toEqual(MOCK_EMAIL);
        expect(newUser!.name).toEqual(MOCK_NAME);
        expect(newUser!.organization.name).toEqual(MOCK_ORG_NAME);
    });
});

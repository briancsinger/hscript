import request from 'supertest';
import mongoose, { mongo } from 'mongoose';

import { Script } from '../../../models/script';
import { app } from '../../../app';

it('returns a 404 if the script is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/${mongoose.Types.ObjectId().toHexString()}/scripts/${id}`)
        .set('Cookie', global.signin())
        .expect(404);
});

it('returns 401 if the user does not own the script', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const scriptProps = {
        name: 'name',
        role: mongoose.Types.ObjectId().toHexString(),
        createdBy: mockUserId,
    };
    const script = Script.build(scriptProps);

    await script.save();

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});

it('returns the script if the script is found', async () => {
    const mockUserId = mongoose.Types.ObjectId().toHexString();
    const scriptProps = {
        name: 'name',
        role: mongoose.Types.ObjectId().toHexString(),
        createdBy: mockUserId,
    };
    const script = Script.build(scriptProps);

    await script.save();

    const response = await request(app)
        .get(`/api/scripts/${script.id}`)
        .set('Cookie', global.signin(mockUserId))
        .expect(200);

    expect(response.body.id).toEqual(script.id.toString());
    expect(response.body.name).toEqual(script.name);
});

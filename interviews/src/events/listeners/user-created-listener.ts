import { Message } from 'node-nats-streaming';

import { Subjects, Listener, UserCreatedEvent } from '@bsnpm/common';

import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';
import { sign } from 'jsonwebtoken';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserCreatedEvent['data'], msg: Message) {
        const { id, email, name, organization, version } = data;
        const newUser = User.build({ name, email, id, organization });

        try {
            await newUser.save();
            msg.ack();
        } catch (e) {
            console.error('failed to save User in UserCreatedListener', e);
        }
    }
}

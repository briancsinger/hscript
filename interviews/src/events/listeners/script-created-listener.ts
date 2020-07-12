import { Message } from 'node-nats-streaming';

import { Subjects, Listener, ScriptCreatedEvent } from '@bsnpm/common';

import { Script } from '../../models/script';
import { queueGroupName } from './queue-group-name';
import { sign } from 'jsonwebtoken';

export class ScriptCreatedListener extends Listener<ScriptCreatedEvent> {
    subject: Subjects.ScriptCreated = Subjects.ScriptCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: ScriptCreatedEvent['data'], msg: Message) {
        const { id, createdBy, items, role, name, version } = data;
        const newScript = Script.build({
            createdBy,
            items,
            role,
            name,
        });

        try {
            await newScript.save();
            msg.ack();
            console.log('Saved Script in ScriptCreatedListener!!');
        } catch (e) {
            console.error('failed to save Script in ScriptCreatedListener', e);
        }
    }
}

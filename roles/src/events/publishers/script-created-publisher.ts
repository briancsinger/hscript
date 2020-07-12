import { ScriptCreatedEvent, Publisher, Subjects } from '@bsnpm/common';

export class ScriptCreatedPublisher extends Publisher<ScriptCreatedEvent> {
    subject: Subjects.ScriptCreated = Subjects.ScriptCreated;
}

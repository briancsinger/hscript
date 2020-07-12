import { Subjects } from './subjects';
import { ScriptItems } from './script-created-event';

export interface ScriptUpdatedEvent {
    subject: Subjects.ScriptUpdated;
    data: {
        id: string;
        createdBy: string;
        items: ScriptItems;
        role: string;
        name: string;
        version: number;
    };
}

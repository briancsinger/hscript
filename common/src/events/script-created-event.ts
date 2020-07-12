import { Subjects } from './subjects';
import { ScriptItemType } from './types/script-item';

interface ScriptItemText {
    type: ScriptItemType.Text;
    text: string;
}

interface ScriptItemQuestion {
    type: ScriptItemType.Question;
    question: string;
}

export interface ScriptItems
    extends Array<ScriptItemQuestion | ScriptItemText> {}

export interface ScriptCreatedEvent {
    subject: Subjects.ScriptCreated;
    data: {
        id: string;
        createdBy: string;
        items: ScriptItems;
        role: string;
        name: string;
        version: number;
    };
}

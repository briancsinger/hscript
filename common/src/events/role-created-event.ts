import { Subjects } from './subjects';

export interface RoleCreatedEvent {
    subject: Subjects.RoleCreated;
    data: {
        id: string;
        createdBy: string;
        name: string;
        version: number;
    };
}

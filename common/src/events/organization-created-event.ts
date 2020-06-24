import { Subjects } from './subjects';

export interface OrganizationCreatedEvent {
    subject: Subjects.OrganizationCreated;
    data: {
        id: string;
        email: string;
        name: string;
        organization: {
            id: string;
            name: string;
        };
        version: number;
    };
}

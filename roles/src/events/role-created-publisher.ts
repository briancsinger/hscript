import { RoleCreatedEvent, Publisher, Subjects } from '@bsnpm/common';

export class RoleCreatedPublisher extends Publisher<RoleCreatedEvent> {
    subject: Subjects.RoleCreated = Subjects.RoleCreated;
}

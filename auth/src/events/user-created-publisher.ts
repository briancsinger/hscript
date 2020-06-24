import { UserCreatedEvent, Publisher, Subjects } from '@bsnpm/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
}

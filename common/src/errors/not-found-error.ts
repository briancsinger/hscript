import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('Route not found');

        // Only bc we're extending a built in calss
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Route not found' }];
    }
}

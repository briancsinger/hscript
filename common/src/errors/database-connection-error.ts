import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statusCode = 500;

    constructor() {
        super('Error connecting to DB');

        // Only bc we're extending a built in calss
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}

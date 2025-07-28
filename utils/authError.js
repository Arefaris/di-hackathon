import { AppError } from './AppError.js';

export class AuthError extends AppError {
    constructor(message, statusCode = 401) {
        super(message, statusCode);
        this.name = 'AuthError';
    }
}

export default AuthError;
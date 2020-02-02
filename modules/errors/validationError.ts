import { ApiError, ErrorCode } from './apiError';

export class ValidationError extends ApiError {
    constructor(message: string | object, errorCode = ErrorCode.ValidationError) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super(message, errorCode);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

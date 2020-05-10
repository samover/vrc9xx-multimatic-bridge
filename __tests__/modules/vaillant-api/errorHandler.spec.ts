import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import { AxiosError } from 'axios';
import { errorHandler } from '../../../modules/vaillant-api/errorHandler';

describe('errorHandler', () => {
    describe('responseError', () => {
        it('throws a new error with custom errorMessage', () => {
            const error = new Error('BOOM');
            // @ts-ignore
            error.response = { status: 400 };

            expect(() => errorHandler(error as AxiosError, 'customErrorMessage')).toThrow('customErrorMessage');
        });
        it('throws an unauthorized error if response is 401', () => {
            const error = new Error('BOOM');
            // @ts-ignore
            error.response = { status: 401 };

            expect(() => errorHandler(error as AxiosError)).toThrow(UnauthorizedError);
        });
    });
    describe('requestError', () => {
        it('throws a new error with custom errorMessage', () => {
            const error = new Error('BOOM');
            // @ts-ignore
            error.request = 'error';

            expect(() => errorHandler(error as AxiosError, 'customErrorMessage')).toThrow('customErrorMessage');
        });
    });
    describe('configError', () => {
        it('throws a new error with custom errorMessage', () => {
            const error = new Error('BOOM');
            expect(() => errorHandler(error as AxiosError, 'customErrorMessage')).toThrow('customErrorMessage');
        });
    });
});

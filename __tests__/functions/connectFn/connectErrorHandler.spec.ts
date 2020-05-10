import { BadRequestError, InternalServerError, UnauthorizedError } from 'aws-lambda-core/lib/errors';
import * as faker from 'faker';
import { errorHandler } from '../../../functions/connectFn/connectErrorHandler';
import { LambdaProxyEvent, Request } from 'aws-lambda-core';
import { apiGatewayProxyEvent } from '../../__helpers';

describe('connectErrorHandler', () => {
    const request = new Request(apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent);

    it('handles an UnauthorizedError', async () => {
        const error = new UnauthorizedError('unauthorized');
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain('Token invalid or expired');
    });

    it('handles an InternalServerError', async () => {
        const error = new InternalServerError('Oops');
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain('Critical service error');
    });

    it('handles a badRequestError', async () => {
        const error = new BadRequestError(faker.lorem.sentence());
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain(error.message);
    });

    it('assumes all unknown errors come from external service', async () => {
        const error = new Error(faker.lorem.sentence());
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain('Invalid Multimatic Credentials');
    })
});

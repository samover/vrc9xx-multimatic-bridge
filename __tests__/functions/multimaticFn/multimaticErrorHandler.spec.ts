import { InternalServerError } from 'aws-lambda-core/lib/errors';
import * as faker from 'faker';
import { LambdaProxyEvent, Request } from 'aws-lambda-core';
import { errorHandler } from '../../../functions/multimaticFn/multimaticErrorHandler';
import { apiGatewayProxyEvent } from '../../__helpers';

describe('multimaticErrorHandler', () => {
    const request = new Request(apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent);

    it('handles an InternalServerError', async () => {
        const error = new InternalServerError('Oops');
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain('Critical service error');
    });

    it('assumes all unknown errors come from external service', async () => {
        const error = new Error(faker.lorem.sentence());
        const errorResponse = await errorHandler(error, request);

        expect(errorResponse.statusCode).toEqual(400);
        expect(errorResponse.body).toContain('Invalid Multimatic Credentials');
    })
});

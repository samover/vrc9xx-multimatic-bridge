import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { ForbiddenError } from '@jmc/errors';
import { LambdaProxyEvent } from '@jmc/lambda-core';
import { JmcState } from '@jmc/security/lib';
import { AuthEntryPoint } from '../../../src/src/AuthEntryPoint';
import { authRoutes } from '../../../src/src/routes';

describe('Auth Init Integration Tests', () => {
    let entryPoint;
    let state: JmcState;
    let path;
    let mocks;

    beforeEach(() => {
        entryPoint = new AuthEntryPoint();
        path = '/auth/init';
        state = {
            callback: path,
            janrainClientId: 'JanrainClientId',
            jmcRedirectUri: 'redirectToJmc',
            jmcRefreshUri: 'refreshUri',
        };
        mocks = require('openid-client').__getMocks__;
    });

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('returns 500 when route is unknown', async () => {
        const event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        const response = await entryPoint.handle(event);
        const jsonBody = JSON.parse(response.body);
        expect(response).toHaveProperty('statusCode', 500);
        expect(jsonBody).toHaveProperty('message', 'Route undefined');
        expect(jsonBody).toHaveProperty('stack');
    });

    it('redirects to PolicyGate authUrl', async () => {
        const event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        event.resource = authRoutes.AUTH_INIT.path;
        event.httpMethod = authRoutes.AUTH_INIT.method;
        event.path = path;
        event.queryStringParameters = {
            state: 'state',
        };

        const response = await entryPoint.handle(event);
        expect(response).toHaveProperty('statusCode', 302);
        expect(response.multiValueHeaders).toHaveProperty('location', ['authorizationUrl']);
        expect(mocks.authorizationUrlMock).toHaveBeenCalledTimes(1);
        expect(mocks.authorizationUrlMock).toHaveBeenCalledWith({
            scope: process.env.MIAA_POLICY_GATE_REQUEST_SCOPE,
            state: 'state',
        });
    });

    it('returns error when something goes wrong', async () => {
        mocks.authorizationUrlMock.mockRejectedValue(new ForbiddenError('Access denied'));

        const event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        event.resource = authRoutes.AUTH_INIT.path;
        event.httpMethod = authRoutes.AUTH_INIT.method;
        event.path = path;
        event.queryStringParameters = {
            state: 'state',
        };

        const response = await entryPoint.handle(event);
        expect(response).toHaveProperty('statusCode', 403);
    });
});


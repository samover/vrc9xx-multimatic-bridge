import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { LambdaProxyEvent, Request } from '@jmc/lambda-core';
import { JmcState, Security } from '@jmc/security/lib';
import { PolicyGate } from '@jmc/security/lib/PolicyGate';
import { RoutePath } from '@jmc/url-builder/lib';
import { IdTokenClaims } from 'openid-client';
import { AuthController } from '../../src/src/AuthController';
import { authRoutes } from '../../src/src/routes';

const getAuthorizationUrlStub = jest.fn();
const fetchTokensStub = jest.fn();
PolicyGate.init = jest.fn().mockReturnValue({
    fetchTokens: fetchTokensStub,
    getAuthorizationUrl: getAuthorizationUrlStub,
});


let controller: AuthController;
let request: Request;
let state: JmcState;

describe('AuthController', () => {
    beforeAll(() => {
        controller = new AuthController(authRoutes);
    });

    describe('GET /auth/callback', () => {
        beforeEach(() => {
            const event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
            state = {
                callback: RoutePath.PROFILE_EDIT,
                janrainClientId: 'clientId',
                jmcRedirectUri: 'redirectUri',
                jmcRefreshUri: 'refreshUri',
            };

            event.resource = '/auth/callback';
            event.httpMethod = 'GET';
            event.queryStringParameters = {
                code: 'code',
                state: Security.encode<JmcState>(state),
            };
            getAuthorizationUrlStub.mockReturnValue('url');
            request = new Request(event as unknown as LambdaProxyEvent);
        });

        it('redirects to the callback encoded in "state', async () => {
            // @ts-ignore
            const claims: IdTokenClaims = {
                exp: (Date.now() / 1000) + 3600,
            };
            fetchTokensStub.mockResolvedValue({
                claims: () => claims,
            });
            const response = await controller.handle(request);

            expect(response.statusCode).toEqual(302);
            expect(response.multiValueHeaders).toHaveProperty('location');
            expect(response.multiValueHeaders['content-type']).toEqual(['text/html']);

            const location = new URL(response.multiValueHeaders.location[0]);
            expect(location.origin).toEqual(process.env.API_BASE_URL);
            expect(location.pathname).toEqual(state.callback);
            expect(location.searchParams.get('token')).toBeDefined();
            expect(location.searchParams.get('state')).toBeDefined();
        });

        it('returns an error response when something goes wrong', async () => {
            fetchTokensStub.mockRejectedValue(new Error('OOPS'));
            const response = await controller.handle(request);

            expect(response.statusCode).toEqual(500);
            expect(JSON.parse(response.body as string).message).toEqual('OOPS');
        });
    });

    describe('GET /auth/init', () => {
        beforeEach(() => {
            const event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
            event.resource = '/auth/init';
            event.httpMethod = 'GET';
            event.queryStringParameters = { state: 'state' };
            getAuthorizationUrlStub.mockReturnValue('url');
            request = new Request(event as unknown as LambdaProxyEvent);
        });

        it('initiates authentication by redirecting to PolicyGate authUrl', async () => {
            const response = await controller.handle(request);

            expect(response.statusCode).toEqual(302);
            expect(response.multiValueHeaders.location[0]).toEqual('url');
            expect(response.multiValueHeaders['content-type']).toEqual(['text/html']);
            expect(getAuthorizationUrlStub).toHaveBeenCalledTimes(1);
            expect(getAuthorizationUrlStub).toHaveBeenCalledWith('state');
        });
        it('returns an error response when something goes wrong', async () => {
            getAuthorizationUrlStub.mockRejectedValue(new Error('OOPS'));
            const response = await controller.handle(request);

            expect(response.statusCode).toEqual(500);
            expect(JSON.parse(response.body as string).message).toEqual('OOPS');
        });
    });
});

import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { BadRequestError } from '@jmc/errors/lib';
import { LambdaProxyEvent } from '@jmc/lambda-core';
import { JmcState, Security } from '@jmc/security/lib';
import { OpenidClientMocks } from '../../../__mocks__/openid-client';
import { AuthEntryPoint } from '../../../src/src/AuthEntryPoint';
import { authRoutes } from '../../../src/src/routes';

describe('Auth Callback Integration Tests', () => {
    beforeEach(() => {
        this.entryPoint = new AuthEntryPoint();
        this.path = '/auth/callback';
        this.state = { callback: this.path, janrainClientId: 'JanrainClientId', jmcRedirectUri: 'redirectToJmc', jmcRefreshUri: 'refreshUri' };
        this.proxyEvent = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        this.proxyEvent.resource = authRoutes.AUTH_CALLBACK.path;
        this.proxyEvent.httpMethod = authRoutes.AUTH_CALLBACK.method;
        this.proxyEvent.path = this.path;
        this.proxyEvent.queryStringParameters = { code: 'code', state: Security.encode<JmcState>(this.state) };

        this.mocks = require('openid-client').__getMocks__ as OpenidClientMocks;
    });

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('returns 500 when route is unknown', async () => {
        this.proxyEvent.resource = '/path/to/unknown';

        const response = await this.entryPoint.handle(this.proxyEvent);

        const jsonBody = JSON.parse(response.body);
        expect(response).toHaveProperty('statusCode', 500);
        expect(jsonBody).toHaveProperty('message', 'Route undefined');
        expect(jsonBody).toHaveProperty('stack');
    });

    it('redirects to callbackUrl with internal apitoken', async () => {
        this.mocks.grantMock.mockResolvedValue({
            claims: () => ({
                codsid: 'codsid',
                email: 'email',
                emailverified: true,
                exp: (Date.now() / 1000) + 3600,
                isvalidated: true,
                locale: 'be_nl',
            }),
        });

        const response = await this.entryPoint.handle(this.proxyEvent);

        expect(response).toHaveProperty('statusCode', 302);
        expect(response.multiValueHeaders).toHaveProperty('location');
        const location = new URL(response.multiValueHeaders.location[0]);
        expect(location.origin).toEqual(process.env.API_BASE_URL);
        expect(location.pathname).toEqual(this.state.callback);
        expect(location.searchParams.get('token')).toBeDefined();
        expect(location.searchParams.get('state')).toBeDefined();

        expect(this.mocks.grantMock).toHaveBeenCalledTimes(1);
        expect(this.mocks.grantMock).toHaveBeenCalledWith({
            code: 'code',
            grant_type: 'authorization_code',
            redirect_uri: process.env.MIAA_POLICY_GATE_REDIRECT_URI,
        });
    });

    it('returns error when something goes wrong', async () => {
        this.mocks.grantMock.mockRejectedValue(new BadRequestError('Something went wrong'));

        const response = await this.entryPoint.handle(this.proxyEvent);
        expect(response).toHaveProperty('statusCode', 400);
    });
});


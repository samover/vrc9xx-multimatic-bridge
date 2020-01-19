import * as faker from 'faker';
import { ClientMetadata } from 'openid-client';
import { OpenidClientMocks } from '../__mocks__/openid-client';
import { OpenIdAuthorizationCodeClient, OpenIdClient, OpenIdClientCredentialsClient } from '../src';

jest.mock('openid-client');
let mocks: OpenidClientMocks;

describe('OpenIdClient', () => {
    beforeEach(async () => {
        mocks = require('openid-client').__getMocks__;
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#init', () => {
        it('initializes an openIdClient', async () => {
            const clientUrl = faker.internet.url();
            const scope = faker.lorem.paragraph();

            const client = await new OpenIdClient().init(clientUrl, scope);

            expect(client).toBeInstanceOf(OpenIdClient);
            // @ts-ignore
            expect(client.scope).toEqual(scope);
            // @ts-ignore
            expect(client.redirectUri).toBeUndefined();

            expect(mocks.discoverMock).toHaveBeenCalledTimes(1);
            expect(mocks.discoverMock).toHaveBeenCalledWith(clientUrl);

            expect(mocks.openIdMockClient).toHaveBeenCalledTimes(1);
            expect(mocks.openIdMockClient).toHaveBeenCalledWith(undefined);
        });

        it('initializes an openIdClient with extra metaData', async () => {
            const clientUrl = faker.internet.url();
            const redirectUrl = faker.internet.url();
            const scope = faker.lorem.paragraph();
            const metaData: ClientMetadata = {
                client_id: faker.internet.userName(),
                client_secret: faker.internet.password(),
                redirect_uris: [redirectUrl],
            };

            const client = await new OpenIdClient().init(clientUrl, scope, metaData);
            // @ts-ignore
            expect(client.redirectUri).toEqual(redirectUrl);

            expect(mocks.openIdMockClient).toHaveBeenCalledTimes(1);
            expect(mocks.openIdMockClient).toHaveBeenCalledWith(metaData);
        });
    });

    describe('#OpenIdAuthorizationCodeClient', () => {
        let clientUrl: string;
        let redirectUrl: string;
        let scope: string;
        let metaData: ClientMetadata;
        let client: OpenIdAuthorizationCodeClient;

        beforeEach(async () => {
            mocks = require('openid-client').__getMocks__;
            clientUrl = faker.internet.url();
            redirectUrl = faker.internet.url();
            scope = faker.lorem.paragraph();
            metaData = {
                client_id: faker.internet.userName(),
                client_secret: faker.internet.password(),
                redirect_uris: [redirectUrl],
                response_types: ['code'],
            };

            client = await new OpenIdAuthorizationCodeClient().init(clientUrl, scope, metaData);
        });

        describe('#init', () => {
            it('returns a OpenIdAuthorizationCodeClient instance', async () => {
                expect(client).toBeInstanceOf(OpenIdAuthorizationCodeClient);
            });
            it('OpenIdAuthorizationClient is extended OpenIdClient', async () => {
                expect(client).toBeInstanceOf(OpenIdClient);
            });
        });

        describe('#getAuthorizationUrl', () => {
            it('invokes openId authorizationUrl function', async () => {
                const authUrl = await client.getAuthorizationUrl('state');
                expect(authUrl).toEqual('authorizationUrl');
                expect(mocks.authorizationUrlMock).toHaveBeenCalledTimes(1);
                expect(mocks.authorizationUrlMock).toHaveBeenCalledWith({ scope, state: 'state' });
            });
        });

        describe('#fetchTokens', () => {
            it('invokes openId getTokens functions with authCode', async () => {
                const tokens = await client.fetchTokens('code');
                expect(tokens).toEqual('tokens');
                expect(mocks.grantMock).toHaveBeenCalledTimes(1);
                expect(mocks.grantMock).toHaveBeenCalledWith({
                    code: 'code',
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUrl,
                });
            });
        });

        describe('#userInfo', () => {
            it('invokes userInfo endpoint and returns UserInfo', async () => {
                const userInfo = await client.userInfo('token');
                expect(userInfo).toEqual('userInfo');
                expect(mocks.userInfoMock).toHaveBeenCalledTimes(1);
                expect(mocks.userInfoMock).toHaveBeenCalledWith('token');
            });
        });
    });

    describe('OpenIdClientCredentialsClient', () => {
        let clientUrl: string;
        let redirectUrl: string;
        let scope: string;
        let metaData: ClientMetadata;
        let client: OpenIdClientCredentialsClient<{ actor_client_id: string }>;

        beforeEach(async () => {
            mocks = require('openid-client').__getMocks__;
            clientUrl = faker.internet.url();
            redirectUrl = faker.internet.url();
            scope = faker.lorem.paragraph();
            metaData = {
                client_id: faker.internet.userName(),
                client_secret: faker.internet.password(),
                redirect_uris: [redirectUrl],
                response_types: ['code'],
            };

            client = await new OpenIdClientCredentialsClient().init(clientUrl, scope, metaData);
        });

        describe('#init', () => {
            it('returns an OpenIdClientCredentialsClient instance', async () => {
                expect(client).toBeInstanceOf(OpenIdClientCredentialsClient);
            });
            it('OpenIdClientCredentialsClient is extended OpenIdClient', async () => {
                expect(client).toBeInstanceOf(OpenIdClient);
            });
        });


        describe('#getClientCredentials', () => {
            it('returns a policyGate instance for server to server auth flow', async () => {
                const actorClientId = faker.random.uuid();
                const credentials = await client.getClientCredentials({ actor_client_id: actorClientId });

                expect(credentials).toEqual('tokens');

                expect(mocks.grantMock).toHaveBeenCalledTimes(1);
                expect(mocks.grantMock).toHaveBeenCalledWith({
                    actor_client_id: actorClientId,
                    grant_type: 'client_credentials',
                    scope,
                });
            });
        });
    });
});


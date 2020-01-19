import * as faker from 'faker';
import {
    createMiaaAutorizationCodeClient,
    createMiaaClientCredentialsClient,
    createPingIdAuthorizationCodeClient,
    OpenIdAuthorizationCodeClient,
    OpenIdClientCredentialsClient,
} from '../src';

const {
    MIAA_POLICY_GATE_URL,
    MIAA_POLICY_GATE_REDIRECT_URI,
    MIAA_POLICY_GATE_CLIENT_ID,
    MIAA_POLICY_GATE_CLIENT_SECRET,
    MIAA_POLICY_GATE_REQUEST_SCOPE,
    MIAA_PROFILE_CONNECT_REQUEST_SCOPE,
    MIAA_PROFILE_CONNECT_URL,
    MIAA_PROFILE_CONNECT_CLIENT_ID,
    MIAA_PROFILE_CONNECT_CLIENT_SECRET,

    PINGID_URL,
    PINGID_CLIENT_ID,
    PINGID_CLIENT_SECRET,
    PINGID_REDIRECT_URI,
    PINGID_REQUEST_SCOPE,
} = process.env;

describe('OpenIdClientFactory', () => {
    describe('#createPingIdAuthorizationCodeClient', () => {
        afterEach(() => { jest.clearAllMocks(); });
        afterAll(() => { jest.restoreAllMocks(); });

        it('creates an instance of an AuthorizationCodeClient for the PingIdProvider', async () => {
            OpenIdAuthorizationCodeClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const client = await createPingIdAuthorizationCodeClient();

            expect(client).toEqual('Initialized client');
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledWith(PINGID_URL, PINGID_REQUEST_SCOPE, {
                client_id: PINGID_CLIENT_ID,
                client_secret: PINGID_CLIENT_SECRET,
                redirect_uris: [PINGID_REDIRECT_URI],
                response_types: ['code'],
            });
        });

        it('creates an instance of an AuthorizationCodeClient for the PingIdProvider with custom metadata', async () => {
            OpenIdAuthorizationCodeClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const metadata = { client_id: faker.lorem.word(), client_secret: faker.lorem.word() }
            const client = await createPingIdAuthorizationCodeClient(metadata);

            expect(client).toEqual('Initialized client');
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledWith(PINGID_URL, PINGID_REQUEST_SCOPE, {
                client_id: metadata.client_id,
                client_secret: metadata.client_secret,
                redirect_uris: [PINGID_REDIRECT_URI],
                response_types: ['code'],
            });
        });
    });

    describe('#createMiaaAutorizationCodeClient', () => {
        afterEach(() => { jest.clearAllMocks(); });
        afterAll(() => { jest.restoreAllMocks(); });

        it('creates an instance of an AuthorizationCodeClient for the MiaaGuardProvider', async () => {
            OpenIdAuthorizationCodeClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const client = await createMiaaAutorizationCodeClient();

            expect(client).toEqual('Initialized client');
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledWith(MIAA_POLICY_GATE_URL, MIAA_POLICY_GATE_REQUEST_SCOPE, {
                client_id: MIAA_POLICY_GATE_CLIENT_ID,
                client_secret: MIAA_POLICY_GATE_CLIENT_SECRET,
                redirect_uris: [MIAA_POLICY_GATE_REDIRECT_URI],
                response_types: ['code'],
            });
        });

        it('creates an instance of an AuthorizationCodeClient for the MiaaGuardProvider with custom metadata', async () => {
            OpenIdAuthorizationCodeClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const metadata = { client_id: faker.lorem.word(), client_secret: faker.lorem.word() }
            const client = await createMiaaAutorizationCodeClient(metadata);

            expect(client).toEqual('Initialized client');
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdAuthorizationCodeClient.prototype.init).toHaveBeenCalledWith(MIAA_POLICY_GATE_URL, MIAA_POLICY_GATE_REQUEST_SCOPE, {
                client_id: metadata.client_id,
                client_secret: metadata.client_secret,
                redirect_uris: [MIAA_POLICY_GATE_REDIRECT_URI],
                response_types: ['code'],
            });
        });
    });

    describe('#createMiaaClientCredentialsClient', () => {
        it('creates an instance of a ClientCredentialsClient for the MiaaGuardProvider', async () => {
            OpenIdClientCredentialsClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const client = await createMiaaClientCredentialsClient();

            expect(client).toEqual('Initialized client');
            expect(OpenIdClientCredentialsClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdClientCredentialsClient.prototype.init).toHaveBeenCalledWith(MIAA_POLICY_GATE_URL, MIAA_PROFILE_CONNECT_REQUEST_SCOPE, {
                client_id: MIAA_PROFILE_CONNECT_CLIENT_ID,
                client_secret: MIAA_PROFILE_CONNECT_CLIENT_SECRET,
                redirect_uris: [],
                response_types: [],
            });
        });

        it('creates an instance of an ClientCredentialsCleint for the MiaaGuardProvider with custom metadata', async () => {
            OpenIdClientCredentialsClient.prototype.init = jest.fn().mockResolvedValue('Initialized client');

            const metadata = { client_id: faker.lorem.word(), client_secret: faker.lorem.word() }
            const client = await createMiaaClientCredentialsClient(metadata);

            expect(client).toEqual('Initialized client');
            expect(OpenIdClientCredentialsClient.prototype.init).toHaveBeenCalledTimes(1);
            expect(OpenIdClientCredentialsClient.prototype.init).toHaveBeenCalledWith(MIAA_POLICY_GATE_URL, MIAA_PROFILE_CONNECT_REQUEST_SCOPE, {
                client_id: metadata.client_id,
                client_secret: metadata.client_secret,
                redirect_uris: [],
                response_types: [],
            });
        });
    });
});

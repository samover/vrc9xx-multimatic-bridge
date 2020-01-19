import { ClientMetadata } from 'openid-client';
import { OpenIdAuthorizationCodeClient } from './OpenIdAuthorizationCodeClient';
import { OpenIdClientCredentialsClient } from './OpenIdClientCredentialsClient';

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

interface MiaaGetClientCredentialsInput {
    actor_client_id: string;
}

class OpenIdClientFactory {
    public createMiaaAutorizationCodeClient(clientMetadata?: ClientMetadata): Promise<OpenIdAuthorizationCodeClient> {
        return new OpenIdAuthorizationCodeClient().init(MIAA_POLICY_GATE_URL, MIAA_POLICY_GATE_REQUEST_SCOPE, {
            client_id: MIAA_POLICY_GATE_CLIENT_ID,
            client_secret: MIAA_POLICY_GATE_CLIENT_SECRET,
            redirect_uris: [MIAA_POLICY_GATE_REDIRECT_URI],
            response_types: ['code'],
            ...clientMetadata,
        });
    }

    public createMiaaClientCredentialsClient(clientMetadata?: ClientMetadata): Promise<OpenIdClientCredentialsClient<MiaaGetClientCredentialsInput>> {
        return new OpenIdClientCredentialsClient<MiaaGetClientCredentialsInput>().init(MIAA_POLICY_GATE_URL, MIAA_PROFILE_CONNECT_REQUEST_SCOPE, {
            client_id: MIAA_PROFILE_CONNECT_CLIENT_ID,
            client_secret: MIAA_PROFILE_CONNECT_CLIENT_SECRET,
            redirect_uris: [],
            response_types: [],
            ...clientMetadata,
        });
    }

    public createPingIdAuthorizationCodeClient(clientMetadata?: ClientMetadata) {
        return new OpenIdAuthorizationCodeClient().init(PINGID_URL, PINGID_REQUEST_SCOPE, {
            client_id: PINGID_CLIENT_ID,
            client_secret: PINGID_CLIENT_SECRET,
            redirect_uris: [PINGID_REDIRECT_URI],
            response_types: ['code'],
            ...clientMetadata,
        });
    }
}

const factory = new OpenIdClientFactory();
export const createPingIdAuthorizationCodeClient = factory.createPingIdAuthorizationCodeClient;
export const createMiaaAutorizationCodeClient = factory.createMiaaAutorizationCodeClient;
export const createMiaaClientCredentialsClient = factory.createMiaaClientCredentialsClient;

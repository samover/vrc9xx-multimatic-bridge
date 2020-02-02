import { IdTokenClaims } from 'openid-client';

export interface JmcState {
    callback: string;
    janrainClientId: string;
    jmcRedirectUri: string;
    jmcRefreshUri: string;
}

export interface MiaaClaims extends IdTokenClaims {
    codsid: string;
    validated_user: string;
}

export { OpenIdAuthorizationCodeClient } from './OpenIdAuthorizationCodeClient';
export { OpenIdClient } from './OpenIdClient';
export { OpenIdClientCredentialsClient } from './OpenIdClientCredentialsClient';
export { createMiaaAutorizationCodeClient, createMiaaClientCredentialsClient, createPingIdAuthorizationCodeClient } from './OpenIdClientFactory';



import { LOGGER } from 'logger';
import { GrantBody, TokenSet, UserinfoResponse } from 'openid-client';
import { OpenIdClient } from './OpenIdClient';

export class OpenIdAuthorizationCodeClient extends OpenIdClient {
    public getAuthorizationUrl(state: string): string {
        return this.client.authorizationUrl({ scope: this.scope, state })
    }

    public fetchTokens(code: string, redirectUri?: string): Promise<TokenSet> {
        const grantBody: GrantBody = {
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri || this.redirectUri,
        };
        LOGGER.debug(grantBody, 'Using this body');
        return this.client.grant(grantBody);
    }

    public async userInfo(token: string): Promise<UserinfoResponse> {
        return this.client.userinfo(token);
    }
}

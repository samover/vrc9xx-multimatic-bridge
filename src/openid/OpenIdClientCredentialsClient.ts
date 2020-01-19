import { LOGGER } from '@jmc/logger';
import { GrantBody, TokenSet } from 'openid-client';
import { OpenIdClient } from './OpenIdClient';

export class OpenIdClientCredentialsClient<T> extends OpenIdClient {
    public getClientCredentials(extraProps: T): Promise<TokenSet> {
        const grantBody: GrantBody = {
            grant_type: 'client_credentials',
            scope: this.scope,
            ...extraProps,
        };

        LOGGER.debug(grantBody, 'Using this body');

        return this.client.grant(grantBody);
    }

}

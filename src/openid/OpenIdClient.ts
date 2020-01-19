import { Client, ClientMetadata, Issuer } from 'openid-client';

export interface IntrospectionResponse {
    active: boolean;
}

export class OpenIdClient {
    protected client: Client;
    protected redirectUri: string;
    protected scope: string;

    public async init(clientUrl: string, scope: string, clientMetadata?: ClientMetadata) {
        const issuer = await Issuer.discover(clientUrl);
        this.client = new issuer.Client(clientMetadata);
        this.scope = scope;
        this.redirectUri = clientMetadata && clientMetadata.redirect_uris[0];
        return this;
    }

    public async introspect(token: string): Promise<IntrospectionResponse> {
        const response = await this.client.introspect(token);
        return {
            active: response.active,
        }
    }

    public async revoke(token: string): Promise<void> {
        await this.client.revoke(token);
    }
}

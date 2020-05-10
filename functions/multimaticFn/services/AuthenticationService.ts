import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import { Authentication, Credentials } from 'vaillant-api';
import { VaillantCredentials } from './VaillantCredentials';

export class AuthenticationService {
    private retryCount = 0;

    private saveCredentials: (jwtToken: string, credentials: Credentials) => Promise<void>;

    private getCredentials: (jwtToken: string) => Promise<Credentials>;

    constructor() {
        this.saveCredentials = VaillantCredentials.save;
        this.getCredentials = VaillantCredentials.get;
    }

    public async reAuthenticate(token: string): Promise<string> {
        this.retryCount += 1;
        if (this.retryCount > 3) {
            throw new UnauthorizedError('Failed to verify');
        }

        const credentials = await this.getCredentials(token);
        const authentication = new Authentication(credentials);
        await authentication.authenticate();
        await this.saveCredentials(token, { ...credentials, sessionId: authentication.getSessionId() });
        return authentication.getSessionId();
    }

    public async getSessionId(token: string): Promise<string> {
        const credentials = await this.getCredentials(token);
        return credentials.sessionId;
    }

    public parseToken(authorizationHeader: string): string {
        return authorizationHeader.replace(/Bearer /, '');
    }
}

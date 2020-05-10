import { Table } from 'dynamodb';
import { encrypt } from 'security';
import { Authentication } from 'vaillant-api';

export class CredentialsService {
    public static async verify(username: string, password: string, smartphoneId: string): Promise<Authentication> {
        // Test Multimatic Connect
        const authentication = new Authentication({
            username,
            smartphoneId,
            sessionId: null,
            authToken: null,
        });
        await authentication.login(password);
        await authentication.authenticate();

        return authentication;
    }

    public static async save(
        authentication: Authentication, userId: string, hasAcceptedTerms: 'false' | 'true',
    ): Promise<void> {
        const table = new Table(process.env.MULTIMATIC_TABLE);
        const secret = encrypt(JSON.stringify(authentication.getCredentials()));
        await table.putItem({ userId, hasAcceptedTerms, secret: JSON.stringify(secret) });
    }
}

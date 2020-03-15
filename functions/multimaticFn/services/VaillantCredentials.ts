import { Table } from 'dynamodb';
import { LOGGER } from 'logger';
import { decrypt, encrypt, Token, UserInfo } from 'security';
import { Credentials } from 'vaillant-api';

export class VaillantCredentials {
    public static async get(jwtToken: string): Promise<Credentials> {
        try {
            const userInfo: UserInfo = Token.decode(jwtToken);
            LOGGER.debug(userInfo, 'UserData');
            const table = new Table(process.env.MULTIMATIC_TABLE);
            const userData: any = await table.getItem({ userId: userInfo.sub });

            LOGGER.debug(userData, 'UserData');

            const secretString: any = decrypt(JSON.parse(userData.secret));

            LOGGER.debug(secretString, 'Vaillant secret');
            const secret = JSON.parse(secretString);
            LOGGER.debug(secret, '################### SECRET');
            return secret as Credentials;
        } catch (e) {
            LOGGER.error(e);
            throw e;
        }
    }

    public static async save(jwtToken: string, credentials: Credentials): Promise<void> {
        try {
            const userInfo: UserInfo = Token.decode(jwtToken);
            const table = new Table(process.env.MULTIMATIC_TABLE);
            const userData: any = await table.getItem({ userId: userInfo.sub });

            const secret = encrypt(JSON.stringify(credentials));
            await table.putItem({ ...userData, secret: JSON.stringify(secret) });
        } catch (e) {
            LOGGER.error(e);
            throw e;
        }
    }
}

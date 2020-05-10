import { Table } from 'dynamodb';
import {
    decrypt, encrypt, Token, UserInfo,
} from 'security';
import { Credentials } from 'vaillant-api';

export class VaillantCredentials {
    public static async get(jwtToken: string): Promise<Credentials> {
        const userInfo: UserInfo = Token.decode(jwtToken);
        const table = new Table(process.env.MULTIMATIC_TABLE);
        const userData: any = await table.getItem({ userId: userInfo.sub });
        const secretString: any = decrypt(JSON.parse(userData.secret));

        return JSON.parse(secretString) as Credentials;
    }

    public static async save(jwtToken: string, credentials: Credentials): Promise<void> {
        const userInfo: UserInfo = Token.decode(jwtToken);
        const table = new Table(process.env.MULTIMATIC_TABLE);
        const userData: any = await table.getItem({ userId: userInfo.sub });

        const secret = encrypt(JSON.stringify(credentials));
        await table.putItem({ ...userData, secret: JSON.stringify(secret) });
    }
}

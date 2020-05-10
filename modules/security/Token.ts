import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import { decode, verify, VerifyOptions } from 'jsonwebtoken';
import { UserInfo } from './common/interfaces';

/** Token class for verifying and decoding a JWT token */
export class Token {
    /**
     * @throws {UnauthorizedError} Unable to verify token
     */
    public static async verify(
        token: string, secret = process.env.ONETIME_TOKEN_SECRET, options?: VerifyOptions,
    ): Promise<UserInfo> {
        return new Promise((resolve, reject) => verify(
            token,
            secret,
            options,
            (err: Error, decoded: object) => {
                if (err) { reject(new UnauthorizedError(err.message)); }
                resolve(decoded as UserInfo);
            },
        ));
    }

    public static decode(token: string): UserInfo {
        return decode(token) as UserInfo;
    }
}

import { decode, sign, verify } from 'jsonwebtoken';
import { InternalServerError, UnauthorizedError } from '../errors';
import { UserInfo } from './common/interfaces';

/** Token class for verifying and decoding a JWT token */
export class Token {
    /**
     * @throws {UnauthorizedError} Unable to verify token
     */
    public static async verify(token: string): Promise<UserInfo> {
        try {
            return new Promise((resolve, reject) =>
                verify(token, process.env.ONETIME_TOKEN_SECRET, (err: Error, decoded: object) => {
                    if (err) { reject(new UnauthorizedError(err.message)); }
                    resolve(decoded as UserInfo);
                }));
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }

    public static decode(token: string): UserInfo {
        try {
            return decode(token) as UserInfo;
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }
}
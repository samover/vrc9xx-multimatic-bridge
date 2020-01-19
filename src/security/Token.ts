import { InternalServerError, UnauthorizedError } from 'errors';
import { LOGGER } from 'logger';
import { decode, sign, verify } from 'jsonwebtoken';
import { UserInfo } from './common/interfaces';
import { parameterStore } from './ParameterStore';

/** Token class for signing and verifying a JWT token */
export class Token {
    /**
     * @throws {UnauthorizedError} Unable to verify token
     */
    public static async verify(token: string): Promise<UserInfo> {
        try {
            const publicKey = await parameterStore.getPublicKey();
            return new Promise((resolve, reject) =>
                verify(token, publicKey, { algorithms: ['RS256'] }, (err: Error, decoded: object) => {
                    if (err) { reject(new UnauthorizedError(err.message)); }
                    resolve(decoded as UserInfo);
                }));
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }
}

import { InternalServerError, UnauthorizedError } from 'errors';
import * as faker from 'faker';
import { sign } from 'jsonwebtoken';
import { Token, UserInfo } from 'security';

describe('Token', () => {
    const signClaim = async (claim: UserInfo, secret?: string): Promise<string> => {
        return new Promise((resolve, reject) =>
            sign(tokenClaim, secret || process.env.ONETIME_TOKEN_SECRET, (err: Error, encoded: string) => {
                if (err) { reject(new UnauthorizedError(err.message)); }
                resolve(encoded);
            }));
    };
    const expirationDate: number = parseInt(`${faker.date.future().valueOf() / 1000}`, 10);
    const tokenClaim: UserInfo = {
        sub: faker.internet.email(),
    };

    describe('decode', () => {
        it('decodes a jwt token and returns the claims', () => {
            const jwtToken = sign(tokenClaim, 'secret');
            const decoded = Token.decode(jwtToken);
            expect(decoded.sub).toEqual(tokenClaim.sub);
        });
    });

    describe('verify', () => {
        it('verifies a JWT token and returns the claims', async () => {

            const token: string = await signClaim(tokenClaim);
            const claims = await Token.verify(token);

            expect(claims.sub).toEqual(tokenClaim.sub);
        });
        it('throws unauthorizedError when token is not correctly signed', async () => {
            const token: string = await signClaim(tokenClaim, 'secret');
            await expect(Token.verify(token)).rejects.toThrow(UnauthorizedError);
        });
    });
});

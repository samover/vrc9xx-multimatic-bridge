import * as faker from 'faker';
import { sign } from 'jsonwebtoken';
import { InternalServerError, UnauthorizedError } from '../../../modules/errors';
import { Token, UserInfo } from '../../../modules/security';

describe('Token', () => {
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
        it('returns null when claim is not a json string', () => {
            const jwtToken = sign('string', 'secret');
            expect(Token.decode(jwtToken)).toBeNull();
        });
    });

    describe('verify', () => {
        it('verifies a JWT token and returns the claims', async () => {
            const token = await Token.sign(tokenClaim, expirationDate);

            const claims = await Token.verify(token);

            expect(claims.userId).toEqual(tokenClaim.userId);
            // @ts-ignore
            expect(claims.exp).toEqual(expirationDate);
        });
        it('throws unauthorizedError when token is not correctly signed', async () => {
            const token = await sign(tokenClaim, 'secret');
            await expect(Token.verify(token)).rejects.toThrow(UnauthorizedError);
        });
        it('throws internalServerError when failing to fetch publicKey', async () => {
            parameterStore.getPublicKey = jest.fn().mockRejectedValueOnce(new Error());
            await expect(Token.verify('token')).rejects.toThrow(InternalServerError);
            // @ts-ignore
            parameterStore.getPublicKey.mockRestore();
        });
    });
});

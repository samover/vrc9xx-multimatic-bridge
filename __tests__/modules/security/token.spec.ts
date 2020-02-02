import { InternalServerError, UnauthorizedError } from '@jmc/errors';
import * as faker from 'faker';
import { sign } from 'jsonwebtoken';
import { __getMocks__ } from '../__mocks__/aws-sdk';
import { Token, UserInfo } from '../src';
import { parameterStore } from '../src/ParameterStore';

describe('Token', () => {
    const expirationDate: number = parseInt(`${faker.date.future().valueOf() / 1000}`, 10);
    const tokenClaim: UserInfo = {
        codsId: faker.random.uuid(),
        email: faker.internet.email(),
        emailVerified: faker.random.boolean(),
        isValidated: faker.random.boolean(),
        locale: faker.random.locale(),
        userId: faker.random.uuid(),
    };

    describe('decode', () => {
        it('decodes a jwt token and returns the claims', () => {
            const jwtToken = sign(tokenClaim, 'secret');
            const decoded = Token.decode<UserInfo>(jwtToken);
            expect(decoded.userId).toEqual(tokenClaim.userId);
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

    describe('sign', () => {
        it('signs a payload and returns the token', async () => {
            const token = await Token.sign(tokenClaim, expirationDate);
            const [header, claims, signature] = token.split('.');
            const decodedClaims = Buffer.from(claims, 'base64').toString('utf-8');
            const decodedHeader = Buffer.from(header, 'base64').toString('utf-8');

            expect(signature).toBeDefined();
            expect(JSON.parse(decodedClaims)).toHaveProperty('userId', tokenClaim.userId)
            expect(JSON.parse(decodedHeader)).toHaveProperty('typ', 'JWT');
            expect(JSON.parse(decodedHeader)).toHaveProperty('alg', 'RS256');
        });
        it('throws internalServerError when signing fails', async () => {
            parameterStore.getPrivateKey = jest.fn().mockResolvedValue('secret');
            await expect(Token.sign(tokenClaim, expirationDate)).rejects.toThrow(InternalServerError);
            // @ts-ignore
            parameterStore.getPrivateKey.mockRestore();
        });
        it('throws internalServerError when failing to fetch privateKey', async () => {
            parameterStore.getPrivateKey = jest.fn().mockRejectedValueOnce(new Error());
            await expect(Token.sign(tokenClaim, expirationDate)).rejects.toThrow(InternalServerError);
            // @ts-ignore
            parameterStore.getPrivateKey.mockRestore();
        });
    });
});

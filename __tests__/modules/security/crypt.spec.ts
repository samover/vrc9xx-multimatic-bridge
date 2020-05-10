import * as crypto from 'crypto';
import * as faker from 'faker';

process.env.CRYPTO_KEY = 'secret';
jest.mock('crypto');

import { decrypt, encrypt } from 'security';
import { ALGORITHM } from '../../../modules/security/Crypt';

describe('Crypt', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#encrypt', () => {
        beforeEach(() => {
            this.cipherUpdateStub = jest.fn().mockReturnValue(Buffer.from('encrypted'));
            this.cipherFinalStub = jest.fn().mockReturnValue(Buffer.from('final'));
            // @ts-ignore
            crypto.createCipheriv.mockReturnValue({
                update: this.cipherUpdateStub,
                final: this.cipherFinalStub,
            });
        });
        it('creates a crypto cypheriv object', () => {
            const encrypted = encrypt('stuff');
            expect(crypto.createCipheriv).toHaveBeenCalledWith(ALGORITHM, expect.any(Buffer), expect.any(Buffer));
        });
        it('updates the cypher object with the value to encrypt', () => {
            const encrypted = encrypt('stuff');
            expect(this.cipherUpdateStub).toHaveBeenCalledWith('stuff');
        });
        it('returns a cypher object', () => {
            const encrypted = encrypt('stuff');
            expect(typeof encrypted.iv).toEqual('string');
            expect(typeof encrypted.encryptedData).toEqual('string');
        });
    });

    describe('#decrypt', () => {
        beforeEach(() => {
            this.cipherUpdateStub = jest.fn().mockReturnValue(Buffer.from('encrypted'));
            this.cipherFinalStub = jest.fn().mockReturnValue(Buffer.from('final'));
            // @ts-ignore
            crypto.createDecipheriv.mockReturnValue({
                update: this.cipherUpdateStub,
                final: this.cipherFinalStub,
            });
            this.cipher = { iv: faker.random.word(), encryptedData: faker.random.word() };
        });
        it('creates a crypto decypheriv object', () => {
            const decryptes = decrypt(this.cipher);
            expect(crypto.createDecipheriv).toHaveBeenCalledWith(ALGORITHM, expect.any(Buffer), expect.any(Buffer));
        });
        it('updates the decypher object with a Buffer from the value to decrypt', () => {
            const decryptes = decrypt(this.cipher);
            expect(this.cipherUpdateStub).toHaveBeenCalledWith(Buffer.from(this.cipher.encryptedData, 'hex'));
        });
        it('returns a decrypted value as string', () => {
            expect(typeof decrypt(this.cipher)).toEqual('string');
        });
    });
});

// MOCKS
import * as faker from 'faker';
import * as securityMock from '../../../__mocks/securityMock';
import * as dynamodbMock from '../../../__mocks/dynamodbMock';

import { VaillantCredentials } from '../../../../functions/multimaticFn/services/VaillantCredentials';

describe('VaillantCredentials', () => {
    beforeEach(() => {
        this.secretString = faker.random.alphaNumeric(100);
        securityMock.init();
        dynamodbMock.init();
        dynamodbMock.getItemStub.mockResolvedValue({ secret: JSON.stringify({ encryptedData: this.secretString }) });
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#get', () => {
        it('parses userId from the JWT token', async () => {
            await VaillantCredentials.get('token');
            expect(securityMock.decodeStub).toHaveBeenCalledWith('token');
        });
        it('fetches secure string based on userId', async () => {
            await VaillantCredentials.get('token');
            expect(dynamodbMock.getItemStub).toHaveBeenCalledWith({ userId: securityMock.username });
        });
        it('decrypts the secure string', async () => {
            await VaillantCredentials.get('token');
            expect(securityMock.decryptStub).toHaveBeenCalledWith({ encryptedData: this.secretString });
        });
        it('returns the decrypted secret as credentails', async () => {
            await expect(VaillantCredentials.get('token')).resolves.toEqual(securityMock.decryptedSecret);
        });
    });

    describe('#save', () => {
        it('parses userId from the JWT token', async () => {
            await VaillantCredentials.save('token', securityMock.decryptedSecret);
            expect(securityMock.decodeStub).toHaveBeenCalledWith('token');
        });
        it('fetches secure string based on userId', async () => {
            await VaillantCredentials.save('token', securityMock.decryptedSecret);
            expect(dynamodbMock.getItemStub).toHaveBeenCalledWith({ userId: securityMock.username });
        });
        it('encrypts the credentials to save', async () => {
            await VaillantCredentials.save('token', securityMock.decryptedSecret);
            expect(securityMock.encryptStub).toHaveBeenCalledWith(JSON.stringify(securityMock.decryptedSecret));
        });
        it('saves the encrypted credentials', async () => {
            await expect(VaillantCredentials.save('token', securityMock.decryptedSecret)).resolves.toBeUndefined();
            expect(dynamodbMock.putItemStub).toHaveBeenCalledWith({ secret: JSON.stringify(securityMock.encryptedData) });
        });
    });
});

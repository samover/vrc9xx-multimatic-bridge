import * as faker from 'faker';
import { UserInfo } from 'security';
import { Credentials } from 'vaillant-api';

export const encryptStub = jest.fn();
export const decryptStub = jest.fn();
export const verifyStub = jest.fn();
export const decodeStub = jest.fn();
export const username = 'username';
export const encryptedData = { encryptedData: 'encrypted' };
export const decryptedSecret: Credentials = {
    username,
    smartphoneId: faker.random.uuid(),
    authToken: faker.internet.password(),
    sessionId: faker.random.uuid(),
};

jest.mock('security', () => ({
    __esModule: true,
    Token: ({
        verify(...args: any): Promise<UserInfo> { return verifyStub(...args); },
        decode(...args: any): UserInfo { return decodeStub(...args); },
    }),
    encrypt: encryptStub,
    decrypt: decryptStub,
}));

export const init = () => {
    verifyStub.mockResolvedValue({ sub: username });
    decodeStub.mockReturnValue({ sub: username });
    encryptStub.mockReturnValue(encryptedData);
    decryptStub.mockReturnValue(JSON.stringify(decryptedSecret));
};

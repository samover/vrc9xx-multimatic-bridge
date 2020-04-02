import { UserInfo } from 'security';

export const encryptStub = jest.fn();
export const verifyStub = jest.fn();
export const decodeStub = jest.fn();
export const username = 'username';
export const encryptedValue = 'encrypted';

jest.mock('security', () => ({
    __esModule: true,
    Token: ({
        verify(): Promise<UserInfo> { return verifyStub(); },
        decode(): UserInfo { return decodeStub(); },
    }),
    encrypt: encryptStub,
}));

export const init = () => {
    verifyStub.mockResolvedValue({ sub: username });
    encryptStub.mockReturnValue({ encryptedData: encryptedValue });
};

import { __getMocks__ } from '../__mocks__/aws-sdk';
import { parameterStore } from '../src/ParameterStore';

describe('parameterStore', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    })
    describe('getPublicKey', () => {
        it('fetches the publicKey from the AWS parameterStore', async () => {
            await expect(parameterStore.getPublicKey()).resolves.toMatch('-----BEGIN PUBLIC KEY-----');
            expect(__getMocks__.SSMGetParameterMock).toHaveBeenCalledTimes(1);
            expect(__getMocks__.SSMGetParameterMock).toHaveBeenCalledWith({
                Name: expect.stringMatching(/public-key/),
                WithDecryption: true,
            });
        });
        it('returns the publicKey if it has already been fetched', async () => {
            // @ts-ignore
            parameterStore.publicKey = 'publicKey';
            await expect(parameterStore.getPublicKey()).resolves.toMatch('publicKey');
            expect(__getMocks__.SSMGetParameterMock).not.toHaveBeenCalled()
        });
        it('fetches the privateKey from the AWS parameterStore', async () => {
            await expect(parameterStore.getPrivateKey()).resolves.toMatch('-----BEGIN RSA PRIVATE KEY-----');
            expect(__getMocks__.SSMGetParameterMock).toHaveBeenCalledTimes(1);
            expect(__getMocks__.SSMGetParameterMock).toHaveBeenCalledWith({
                Name: expect.stringMatching(/private-key/),
                WithDecryption: true,
            });
        });
        it('returns the private if it has already been fetched', async () => {
            // @ts-ignore
            parameterStore.privateKey = 'privateKey';
            await expect(parameterStore.getPrivateKey()).resolves.toMatch('privateKey');
            expect(__getMocks__.SSMGetParameterMock).not.toHaveBeenCalled()
        });
    });
});

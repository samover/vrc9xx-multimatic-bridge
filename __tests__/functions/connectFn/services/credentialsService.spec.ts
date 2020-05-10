// MOCKS AND HELPERS
import * as tableMock from '../../../__mocks/dynamodbMock';
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';
import * as securityMock from '../../../__mocks/securityMock';

import * as faker from 'faker';
import { Authentication } from '../../../../modules/vaillant-api';
import { CredentialsService } from '../../../../functions/connectFn/services/credentialsService';

describe('CredentialsService', () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const smartphoneId = faker.random.uuid();

    beforeEach(() => {
        vaillantApiMock.init();
        tableMock.init();
        securityMock.init();
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#verify', () => {
        it('verifies the vaillant credentials', async () => {
            await CredentialsService.verify(username, password, smartphoneId);

            expect(vaillantApiMock.loginStub).toHaveBeenCalledTimes(1);
            expect(vaillantApiMock.loginStub).toHaveBeenCalledWith(password);
        });
        it('authenticates with the vaillant service', async () => {
            await CredentialsService.verify(username, password, smartphoneId);

            expect(vaillantApiMock.authenticateStub).toHaveBeenCalledTimes(1);
        });
        it('returns a vaillant authentication instance', async () => {
            const authentication = await CredentialsService.verify(username, password, smartphoneId);
            expect(authentication).toHaveProperty('login');
            expect(authentication).toHaveProperty('authenticate');
        })
    });

    describe('#save', () => {
        const authentication = new Authentication({
            username,
            smartphoneId,
            sessionId: vaillantApiMock.sessionId,
            authToken: vaillantApiMock.authToken,
        });

        it('encrypts the vaillant credentials', async () => {
            await CredentialsService.save(authentication, 'userId', 'true');
            expect(securityMock.encryptStub).toHaveBeenCalledTimes(1);
            expect(securityMock.encryptStub).toHaveBeenCalledWith(JSON.stringify(authentication.getCredentials()));
        });
        it('saves the encrypted credentials and user data in dynamodb', async () => {
            await CredentialsService.save(authentication, 'userId', 'true');
            expect(tableMock.putItemStub).toHaveBeenCalledTimes(1);
            expect(tableMock.putItemStub).toHaveBeenCalledWith({
                userId: 'userId',
                hasAcceptedTerms: 'true',
                secret: JSON.stringify(securityMock.encryptedData),
            });
        });
    });
});

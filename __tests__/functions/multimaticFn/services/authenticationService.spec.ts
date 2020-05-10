import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import * as faker from 'faker';

// MOCKS
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';

import { AuthenticationService } from '../../../../functions/multimaticFn/services/AuthenticationService';

describe('AuthenticationService', () => {
    beforeEach(() => {
        this.service = new AuthenticationService();
    });

    describe('#parseToken', () => {
        it('parses the jwt token from an authorization header', () => {
            const token = `Bearer token`;
            expect(this.service.parseToken(token)).toEqual('token');
        });
        it('return header untouched when it does not contain a bearer token', () => {
            const header = faker.lorem.sentence();
            expect(this.service.parseToken(header)).toEqual(header);
        });
    });

    describe('#getSessionId', () => {
        it('fetches a sessionid from the vaillant service', async () => {
            this.service.getCredentials = jest.fn().mockResolvedValue({ sessionId: 'sessionId' });

            await expect(this.service.getSessionId('token')).resolves.toEqual('sessionId');
            expect(this.service.getCredentials).toHaveBeenCalledWith('token');
        })
    });

    describe('reAuthenticate', () => {
        beforeEach(() => {
            vaillantApiMock.init();
        });
        afterEach(() => jest.clearAllMocks());
        afterAll(() => jest.restoreAllMocks());

        it('authenticates against the Vaillant api', async () => {
            const token = faker.random.uuid();
            const credentials = { username: faker.internet.userName(), sessionId: faker.random.uuid() };

            this.service.getCredentials = jest.fn().mockResolvedValue(credentials);
            this.service.saveCredentials = jest.fn();

            await expect(this.service.reAuthenticate(token)).resolves.toEqual(vaillantApiMock.sessionId);

            expect(this.service.getCredentials).toHaveBeenCalledWith(token);
            expect(this.service.saveCredentials).toHaveBeenCalledWith(token, { ...credentials, sessionId: vaillantApiMock.sessionId });
            expect(vaillantApiMock.authenticateStub).toHaveBeenCalledTimes(1);
        });

        it('only allows three reauthentications', async () => {
            this.service.retryCount = 3;
            await expect(this.service.reAuthenticate('token')).rejects.toThrow(UnauthorizedError);
        });
    });
});

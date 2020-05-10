import * as faker from 'faker';
import { Authentication, Credentials } from 'vaillant-api';
import axios from 'axios';
import { ApiPath } from '../../../modules/vaillant-api/ApiPath';
import { errorHandler } from '../../../modules/vaillant-api/errorHandler';

jest.mock('axios');
jest.mock('../../../modules/vaillant-api/errorHandler');

describe('Authentication', () => {
    const password = faker.internet.password(64);
    const authToken = faker.random.alphaNumeric(24);
    const jsessionId = faker.random.uuid();
    const credentials: Credentials = {
        username: faker.internet.userName(),
        smartphoneId: faker.random.uuid(),
        authToken: null,
        sessionId: faker.random.uuid(),
    };

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getSessionId', () => {
        it('returns sessionId', () => {
            const authentication = new Authentication(credentials);
            expect(authentication.getSessionId()).toEqual(credentials.sessionId);
        });
    });
    describe('#getAuthToken', () => {
        it('returns authToken', () => {
            const authentication = new Authentication({ ...credentials, authToken });
            expect(authentication.getAuthToken()).toEqual(authToken);
        });
    });
    describe('#getCredentials', () => {
        it('returns credentials', () => {
            const authentication = new Authentication(credentials);
            expect(authentication.getCredentials()).toEqual(credentials);
        });
    });
    describe('#login', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body: {
                        authToken,
                    }
                }
            });
        });
        it('invokes vaillant api with username, password and smartphoneId', async () => {
            const authentication = new Authentication(credentials);
            await authentication.login(password);

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.newToken(),
                data: { username: credentials.username, password, smartphoneId: credentials.smartphoneId },
                method: 'POST',
            });
        });
        it('saves authToken in state', async () => {
            const authentication = new Authentication(credentials);
            await authentication.login('password');

            expect(authentication.getAuthToken()).toEqual(authToken);
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const authentication = new Authentication(credentials);
            await authentication.login('password');

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });

    describe('#authenticate', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                headers: {
                    ['set-cookie']: [`JSESSIONID=${jsessionId}`],
                }
            });
        });
        it('invokes vaillant api with username, authToken and smartphoneId', async () => {
            const authentication = new Authentication({ ...credentials, authToken });
            await authentication.authenticate();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.authenticate(),
                data: { username: credentials.username, authToken, smartphoneId: credentials.smartphoneId },
                method: 'POST',
            });
        });
        it('saves sessionId cookie in state', async () => {
            const authentication = new Authentication({ ...credentials, authToken });
            await authentication.authenticate();

            expect(authentication.getSessionId()).toEqual(jsessionId);
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const authentication = new Authentication(credentials);
            await authentication.authenticate();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

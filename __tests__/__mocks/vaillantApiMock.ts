import { Authentication } from 'vaillant-api';
import { MockOf } from '../__helpers/mockOf.type';

export const loginStub = jest.fn();
export const authenticateStub = jest.fn();
export const authToken = 'authToken';
export const sessionId = 'sessionId';

jest.mock('vaillant-api', () => ({
    __esModule: true,
    Authentication: jest.fn().mockImplementation((): MockOf<Authentication> => ({
        login(): Promise<void> { return loginStub(); },
        authenticate(): Promise<void> { return authenticateStub(); },
        getAuthToken: (): string => authToken,
        getSessionId: (): string => sessionId,
    })),
}));

export const init = () => {
    loginStub.mockResolvedValue(null);
    authenticateStub.mockResolvedValue(null);
};


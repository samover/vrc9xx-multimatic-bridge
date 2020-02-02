import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { HandlerAction, LambdaProxyEvent, Request, Response } from '@jmc/lambda-core';
import { Session } from '@jmc/session';
import { RoutePath } from '@jmc/url-builder';
import { Strings } from '@jmc/utils'
import * as faker from 'faker';
import { sign } from 'jsonwebtoken';
import { checkSession, isAuthenticated } from '../../src/middleware/accessManagement.middleware';

describe('AccessManagement Middleware', () => {
    let isActiveSessionStub: jest.Mock;
    let invalidateSessionStub: jest.Mock;
    let encodeStub: jest.Mock;
    let redirectStub: jest.Mock;
    let event: LambdaProxyEvent;
    let action: HandlerAction;

    beforeEach(() => {
        redirectStub = jest.fn().mockImplementation(() => ({
            send: () => 'redirect',
        }));
        encodeStub = jest.fn().mockReturnValue('encodedState');
        isActiveSessionStub = jest.fn().mockResolvedValue(true);
        invalidateSessionStub = jest.fn();

        Strings.encode = encodeStub;
        Response.redirect = redirectStub;
        Session.isActive = isActiveSessionStub;
        Session.invalidate = invalidateSessionStub;
        event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        action = {
            authenticated: true,
            method: 'GET',
            name: 'actionName',
            path: '/users',
            roles: [],
            useSession: false,
        };
    });

    afterEach(() => { jest.clearAllMocks(); });
    afterAll(() => { jest.restoreAllMocks(); })

    describe('checkSession', () => {
        it('returns null when no session is required', async () => {
            const request = new Request(event);
            action.useSession = false;

            await expect(checkSession(request, action)).resolves.toBeNull();
            expect(request.getSession()).toBeFalsy();
        });

        it(`redirects to ${RoutePath.AUTH_INIT} session is required but no sessionId is present in the header`, async () => {
            const request = new Request(event);
            action.useSession = true;

            await expect(checkSession(request, action)).resolves.toEqual('redirect');
            expect(request.getSession()).toBeFalsy();
            expect(redirectStub).toHaveBeenCalledWith(request,
                `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`);
        });

        it(`redirects to ${RoutePath.AUTH_INIT} session is required and inactive sessionId is present in the header`, async () => {
            action.useSession = true;
            const request = new Request(event);
            // @ts-ignore
            request.cookies.session = 'sessionId';
            isActiveSessionStub.mockResolvedValue(false);

            await expect(checkSession(request, action)).resolves.toEqual('redirect');
            expect(request.getSession()).toBeFalsy();
            expect(redirectStub).toHaveBeenCalledWith(request,
                `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`);
            expect(invalidateSessionStub).toHaveBeenCalledTimes(1);
            expect(invalidateSessionStub).toHaveBeenCalledWith('sessionId');
        });
        it('resolves when session is required and active sessionId is present in the header', async () => {
            action.useSession = true;
            const request = new Request(event);
            // @ts-ignore
            request.cookies.session = 'sessionId';
            isActiveSessionStub.mockResolvedValue(true);

            await expect(checkSession(request, action)).resolves.toBeUndefined();
            expect(request.getSession()).toBeTruthy();
            expect(invalidateSessionStub).toHaveBeenCalledTimes(1);
            expect(invalidateSessionStub).toHaveBeenCalledWith('sessionId');
        });
    });
    describe('#isAuthenticated', () => {
        it('returns null when action is not authenticated', async () => {
            action.authenticated = false;
            await expect(isAuthenticated(new Request(event), action)).resolves.toBeNull();
        });
        it('returns null when request is authenticated', async () => {
            const request = new Request(event);
            request.isAuthenticated = true;

            await expect(isAuthenticated(request, action)).resolves.toBeNull();
        });
        it(`redirects to ${RoutePath.AUTH_INIT} when request is not authenticated for an authenticated endpoint`, async () => {
            const request = new Request(event);
            const path = faker.random.word();
            const clientId = faker.random.word();
            const redirectUrl = faker.internet.url();
            const refreshUrl = faker.internet.url();
            request.isAuthenticated = false;

            // @ts-ignore
            request.query = { clientId, redirectUrl, refreshUrl };
            // @ts-ignore
            request.path = path;
            action.authenticated = true;

            // WITH no token or existing state
            await expect(isAuthenticated(request, action)).resolves.toEqual('redirect');
            expect(redirectStub).toHaveBeenCalledTimes(1);
            expect(redirectStub).toHaveBeenCalledWith(request, `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`)

            expect(Strings.encode).toHaveBeenCalledWith({
                callback: path,
                janrainClientId: clientId,
                jmcRedirectUri:  redirectUrl,
                jmcRefreshUri: refreshUrl,
            });

            // WITH existing state. Preference is given to queryParams
            jest.clearAllMocks();
            let existingClaims = {
                callback: faker.random.word(),
                janrainClientId: faker.random.word(),
                jmcRedirectUri:  faker.random.word(),
                jmcRefreshUri: faker.random.word(),
            };
            let state = Buffer.from(JSON.stringify(existingClaims)).toString('base64');
            // @ts-ignore
            request.cookies.state = state;
            await expect(isAuthenticated(request, action)).resolves.toEqual('redirect');
            expect(redirectStub).toHaveBeenCalledTimes(1);
            expect(redirectStub).toHaveBeenCalledWith(request, `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`)

            expect(Strings.encode).toHaveBeenCalledWith({
                callback: path,
                janrainClientId: clientId,
                jmcRedirectUri:  redirectUrl,
                jmcRefreshUri: refreshUrl,
            });

            // WITH existing state, no queryParams
            jest.clearAllMocks();
            existingClaims = {
                callback: faker.random.word(),
                janrainClientId: faker.random.word(),
                jmcRedirectUri:  faker.random.word(),
                jmcRefreshUri: faker.random.word(),
            };
            state = Buffer.from(JSON.stringify(existingClaims)).toString('base64');
            // @ts-ignore
            request.cookies.state = state;
            // @ts-ignore
            request.query = {};
            await expect(isAuthenticated(request, action)).resolves.toEqual('redirect');
            expect(redirectStub).toHaveBeenCalledTimes(1);
            expect(redirectStub).toHaveBeenCalledWith(request, `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`)

            expect(Strings.encode).toHaveBeenCalledWith({
                callback: path,
                janrainClientId: existingClaims.janrainClientId,
                jmcRedirectUri:  existingClaims.jmcRedirectUri,
                jmcRefreshUri: existingClaims.jmcRefreshUri,
            });

            // WITH token containing clientId
            jest.clearAllMocks();
            const clientIdInToken = faker.random.word();
            const token = sign({ clientid: clientIdInToken }, 'secret');
            // @ts-ignore
            request.cookies.state = state;
            // @ts-ignore
            request.query = { token };
            await expect(isAuthenticated(request, action)).resolves.toEqual('redirect');
            expect(redirectStub).toHaveBeenCalledTimes(1);
            expect(redirectStub).toHaveBeenCalledWith(request, `${process.env.API_BASE_URL}${RoutePath.AUTH_INIT}?state=encodedState`)

            expect(Strings.encode).toHaveBeenCalledWith({
                callback: path,
                janrainClientId: clientIdInToken,
                jmcRedirectUri:  existingClaims.jmcRedirectUri,
                jmcRefreshUri: existingClaims.jmcRefreshUri,
            });
        })
    });
});

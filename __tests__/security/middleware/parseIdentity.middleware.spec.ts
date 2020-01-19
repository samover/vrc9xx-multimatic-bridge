/* tslint:disable:object-literal-sort-keys */
import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { HandlerAction, LambdaProxyEvent, Request, Response } from '@jmc/lambda-core';
import { OpenIdAuthorizationCodeClient } from '@jmc/openid';
import { Session } from '@jmc/session';
import { RoutePath } from '@jmc/url-builder';
import { Strings } from '@jmc/utils'
import * as faker from 'faker';
import { sign } from 'jsonwebtoken';
import { MiaaClaims, Token } from '../../src';
import { parseIdentity } from '../../src/middleware/parseIdentity.middleware';

describe('parseIdentity middleware', () => {
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

    it('is not authenticated when there is no accessToken', async () => {
        const request = new Request(event);
        // @ts-ignore
        delete request.cookies.accesstoken;
        await parseIdentity(request, null);

        expect(request.isAuthenticated).toBeFalsy();
        expect(request.getToken()).toBeNull();
    });

    it('is not authenticated when accessToken is invalid', async () => {
        const request = new Request(event);
        // @ts-ignore
        request.cookies.accessToken = 'invalidToken';
        OpenIdAuthorizationCodeClient.prototype.introspect = jest.fn().mockResolvedValue({ active: false });
        await parseIdentity(request, null);

        expect(request.isAuthenticated).toBeFalsy();
        expect(request.getToken()).toBeNull();
    });

    it('with valid accessToken request is authenticated and userinfo is added to requestIdentity', async () => {
        const request = new Request(event);
        // @ts-ignore
        request.cookies.accesstoken = 'validToken';
        const claims: MiaaClaims = {
            aud: undefined, exp: 0, iat: 0, iss: '',
            sub: faker.random.uuid(),
            locale: 'en',
            codsid: faker.random.uuid(),
            email: faker.internet.email(),
            email_verified: faker.random.boolean(),
            validated_user: 'VALID_USER'
        };
        OpenIdAuthorizationCodeClient.prototype.introspect = jest.fn().mockResolvedValue({ active: true });
        Token.decode = jest.fn().mockReturnValue(claims);
        await parseIdentity(request, null);

        expect(request.isAuthenticated).toBeTruthy();
        expect(request.getToken()).toEqual('validToken');
        expect(request.getIdentity()).toEqual(expect.objectContaining({
            codsId: claims.codsid as string,
            email: claims.email,
            emailVerified: claims.email_verified,
            isValidated: true,
            locale: claims.locale,
            userId: claims.sub,
        }));
    });
});

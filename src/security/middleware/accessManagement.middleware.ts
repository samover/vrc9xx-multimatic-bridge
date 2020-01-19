import { HandlerAction, Middleware, Request, Response, ResponseBody } from '@jmc/lambda-core';
import { LOGGER } from '@jmc/logger';
import { Session } from '@jmc/session';
import { RoutePath, UrlBuilder } from '@jmc/url-builder';
import { Strings } from '@jmc/utils';
import { JmcState } from '../common/interfaces';
import { Token } from '../Token';

interface JmcClaims {
    clientid: string;
    codsid: string;
}

const getState = (request: Request): JmcState => {
    const existingState: JmcState | { [key: string]: any } = Strings.decode<JmcState>(request.getCookie('state') as string) || {};

    // both old Jmc and new Jmc should be able to invoke the profileGate
    const jmcClaims: JmcClaims = Token.decode<JmcClaims>(request.getQueryParam<string>('token'));

    return {
        callback: request.getPath(),
        janrainClientId: (jmcClaims && jmcClaims.clientid) || request.getQueryParam<string>('clientId') || existingState.janrainClientId,
        jmcRedirectUri:  request.getQueryParam<string>('redirecturl') || request.getQueryParam<string>('redirectUrl') || existingState.jmcRedirectUri,
        jmcRefreshUri: request.getQueryParam<string>('refreshUrl') || existingState.jmcRefreshUri,
    };
};

/**
 *  Middleware that handles redirect to PolicyGate if not authenticated
 *
 * @remarks
 * Expects that JMC sends the following query params:
 *
 *  - query.clientId
 *  - query.redirectUrl
 *  - query.refreshUrl
 */
export const isAuthenticated: Middleware = async (request: Request, action: HandlerAction): Promise<ResponseBody> => {
    if (!action.authenticated || request.isAuthenticated) { return null; }

    LOGGER.debug('User not authenticated. Redirecting to login');

    const jmcState: JmcState = getState(request);
    return Response.redirect(request, UrlBuilder.build(RoutePath.AUTH_INIT, { state: Strings.encode(jmcState) })).send();
};


/**
 *  Middleware that handles redirect to PolicyGate if not session is required but does not exist
 *
 * @remarks
 * Expects that JMC sends the following query params:
 *
 *  - query.clientId
 *  - query.redirectUrl
 *  - query.refreshUrl
 */
export const checkSession: Middleware = async (request: Request, action: HandlerAction): Promise<ResponseBody> => {
    request.setSession(false);
    if (!action.useSession) { return null; }

    const sessionId = request.getCookie('session') as string;
    LOGGER.debug(sessionId, 'SessionId found');

    if (sessionId) {
        const isActive: boolean = await Session.isActive(sessionId);
        request.setSession(isActive);
        await Session.invalidate(sessionId);
    }

    if (!request.getSession()) {
        LOGGER.debug('No session found.');
        const jmcState: JmcState = getState(request);
        return Response.redirect(request, UrlBuilder.build(RoutePath.AUTH_INIT, { state: Strings.encode(jmcState) })).send();
    }
};

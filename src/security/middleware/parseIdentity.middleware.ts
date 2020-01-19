import { Middleware, Request } from '@jmc/lambda-core';
import { LOGGER } from '@jmc/logger';
import { createMiaaAutorizationCodeClient } from '@jmc/openid';
import { MiaaClaims, UserInfo } from '../common/interfaces';
import { Token } from '../Token';

export const parseIdentity: Middleware = async (request: Request): Promise<void> => {
    try {
        const token: string = request.getCookie('accessToken') as string;
        if (!token) { throw new Error('Missing token'); }

        // VERIFY TOKEN. Currently only HCP's are allowed access to the Profilegate authenticated endpoints
        const openidClient = await createMiaaAutorizationCodeClient();
        const introspectionResponse = await openidClient.introspect(token);
        if (!introspectionResponse.active) { throw new Error('Invalid token'); }

        const claims: MiaaClaims = Token.decode<MiaaClaims>(token);
        const userInfo: UserInfo = {
            codsId: claims.codsid as string,
            email: claims.email,
            emailVerified: claims.email_verified,
            isValidated: claims.validated_user === 'VALID_USER',
            locale: claims.locale,
            userId: claims.sub,
        };

        request.addToIdentity(userInfo);
        request.isAuthenticated = true;
        request.setToken(token);
    } catch (e) {
        LOGGER.debug(e, 'Token validation failed');
        request.isAuthenticated = false;
        request.setToken(null);
        return null;
    }
};

import { UnauthorizedError } from 'errors';
import { LOGGER } from 'logger';
import { HandlerAction, Middleware, Request } from '../';

/**
 *  Middleware that checks authentication state agains route
 */
export const isAuthenticated: Middleware = async (request: Request, action: HandlerAction): Promise<void> => {
    if (action.authenticated && !request.isAuthenticated) {
        LOGGER.debug('User not authenticated. Redirecting to login');
        throw new UnauthorizedError('Authentication required');
    }
};

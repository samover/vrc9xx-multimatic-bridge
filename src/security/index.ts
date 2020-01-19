import { checkSession, isAuthenticated }  from './middleware/accessManagement.middleware';
import { parseIdentity } from './middleware/parseIdentity.middleware';

export { Token } from './Token';
export { UserInfo, JmcState, MiaaClaims } from './common/interfaces'
export const middleware = { checkSession, isAuthenticated, parseIdentity };

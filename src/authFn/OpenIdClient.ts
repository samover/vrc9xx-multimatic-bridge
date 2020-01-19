// import { InternalServerError } from 'errors';
// import { LOGGER } from 'logger';
// import { AuthorizationParameters, Client, GrantBody, Issuer } from 'openid-client';
//
// const { AUTH0_CONNECT_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_REDIRECT_URI, AUTH0_REQUEST_SCOPE } = process.env;
//
// /** Class representing the service wrapper for AUTH0 Policy Gate */
// export class OpenIdClient {
//     private client: Client;
//     private redirectUri: string;
//
//     /**
//      *
//      * @param {Issuer<Client>} Constructor for the openId Connect client
//      */
//     constructor(issuer: Issuer<Client>) {
//         this.redirectUri = AUTH0_REDIRECT_URI;
//         this.client = new issuer.Client({
//             client_id: AUTH0_CLIENT_ID,
//             client_secret: AUTH0_CLIENT_SECRET,
//             redirect_uris: [this.redirectUri],
//             response_types: ['code'],
//         });
//     }
//
//     public static async init() {
//         const issuer = await Issuer.discover(AUTH0_CONNECT_URL);
//         return new OpenIdClient(issuer);
//     }
//
//     public getAuthorizationUrl() {
//         try {
//         const authorizationParameters: AuthorizationParameters = { scope: AUTH0_REQUEST_SCOPE };
//         LOGGER.debug(authorizationParameters, 'Starting init with these parameters');
//         return this.client.authorizationUrl(authorizationParameters);
//         } catch (e) {
//             throw new InternalServerError(`OpenidConnect Failed with ${e.message}`)
//         }
//     }
//
//     public fetchTokens(code: string) {
//         try {
//             const grantBody: GrantBody = { code, grant_type: 'authorization_code', redirect_uri: this.redirectUri };
//             LOGGER.debug(grantBody, 'Fetching tokens using this body');
//             return this.client.grant(grantBody);
//         } catch (e) {
//             throw new InternalServerError(`OpenidConnect Failed with ${e.message}`)
//         }
//     }
//
//     public async endSession(idToken: string, redirectUrl: string, state: string) {
//         try {
//             LOGGER.debug('Retrieving endSessionUrl');
//             return this.client.endSessionUrl({
//                 id_token_hint: idToken,
//                 post_logout_redirect_uri: redirectUrl,
//                 state,
//             });
//         } catch (e) {
//             throw new InternalServerError(`Failed retrieving endSessionUrl: ${e.message}`);
//         }
//     }
// }

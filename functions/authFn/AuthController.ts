// import {ErrorCode} from 'errors';
// import {
//     Authenticated,
//     Get,
//     Handler,
//     Middleware,
//     Post,
//     Request,
//     Response,
//     ResponseBody,
//     ValidateBody,
//     ValidateQuery
// } from 'lambda-core';
// import {LOGGER} from 'logger';
// import {TokenSet} from 'openid-client';
// import {Security} from 'security';
// import {RoutePath, UrlBuilder} from 'url-builder';
// import {AuthCallbackRequestQuery} from './dtos/AuthCallbackRequestQuery';
// import {AuthLogoutCallbackRequestQuery} from './dtos/AuthLogoutCallbackRequestQuery';
// import {AuthLogoutRequestBody} from './dtos/AuthLogoutRequestBody';
// import {OpenIdClient} from './OpenIdClient';
//
// export interface PolicyGateState {
//     redirectUrl: string;
// }
//
// // /auth/init
// // /auth/
// /** Class representing the controller for the Auth Lambda */
// export class AuthController extends Handler {
//     protected middleware: Middleware[] = [];
//
//     @Get('/auth/init')
//     private async authInit(request: Request): Promise<ResponseBody> {
//         LOGGER.debug('Initiating authentication flow');
//
//         try {
//             const policyGate = await OpenIdClient.init();
//             const url = await policyGate.getAuthorizationUrl();
//
//             return Response.redirect(request, url).send();
//         } catch (e) {
//             LOGGER.error(e, 'AuthInit Route failed');
//             return Response.fromError(request, e);
//         }
//     }
//
//     @Get('/auth/callback')
//     @ValidateQuery(AuthCallbackRequestQuery, { allowUnknownFields: true })
//     private async authCallback(request: Request): Promise<ResponseBody> {
//         const code: string = request.getQueryParam<string>('code');
//
//         try {
//             const policyGate = await OpenIdClient.init();
//             const tokens: TokenSet = await policyGate.fetchTokens(code);
//             LOGGER.debug(tokens, 'Tokens found');
//
//             return this.respondWithTokenCookies(request, {
//                 accessToken: tokens.access_token,
//                 expiration: tokens.claims().exp,
//                 redirectUrl: '/profile',
//             });
//         } catch (e) {
//             LOGGER.error(e, 'AuthCallback Route failed');
//             return Response.redirect(
//                 request,
//                 UrlBuilder.build(decodedState.redirectUrl, { errorMessage: e.message, errorCode: e.errorCode || ErrorCode.InternalServerError }),
//                 { cors: false },
//             ).send();
//         }
//     }
//
//     @Post('/auth/logout')
//     @ValidateBody(AuthLogoutRequestBody)
//     @Authenticated()
//     private async authLogout(request: Request): Promise<ResponseBody> {
//         const redirectUrl: string = request.getBody<AuthLogoutRequestBody>().redirectUrl;
//
//         try {
//             const miaaToken: string = request.getCookie('logoutToken') as string;
//             const policyGate = await OpenIdClient.init();
//             const state: string = Security.encode<PolicyGateState>({ redirectUrl });
//             const callbackUrl = UrlBuilder.build(RoutePath.AUTH_LOGOUT_CALLBACK);
//             const miaaLogoutUrl = await policyGate.endSession(miaaToken, callbackUrl, state);
//             return Response.ok(request).send({ logoutUrl: miaaLogoutUrl });
//         } catch (e) {
//             LOGGER.error(e, 'AuthLogout Route failed');
//             return Response.fromError(request, e);
//         }
//     }
//
//     @Get('/auth/logout/callback')
//     @ValidateQuery(AuthLogoutCallbackRequestQuery, { allowUnknownFields: true })
//     @Authenticated()
//     private async authLogoutCallback(request: Request): Promise<ResponseBody> {
//         const state: string = request.getQueryParam<string>('state');
//         const decodedState: PolicyGateState = Security.decode<PolicyGateState>(state);
//
//         try {
//             const response = Response.redirect(
//                 request,
//                 UrlBuilder.build(decodedState.redirectUrl),
//                 { cors: false });
//             response.addCookie('accessToken', 'deleted', { expires: new Date()});
//             response.addCookie('refreshToken', 'deleted', { expires: new Date() });
//             response.addCookie('logoutToken', 'deleted', { expires: new Date() });
//             return response.send();
//         } catch (e) {
//             LOGGER.error(e, 'AuthLogoutCallback Route failed');
//             return Response.redirect(
//                 request,
//                 UrlBuilder.build(decodedState.redirectUrl, { errorMessage: e.message, errorCode: e.errorCode || ErrorCode.InternalServerError }),
//                 { cors: false },
//             ).send();
//         }
//     }
//
//     private respondWithTokenCookies(request: Request, data: { redirectUrl: string; accessToken: string; expiration: number; }) {
//         const response = Response.redirect(request, UrlBuilder.build(data.redirectUrl), { cors: false });
//         response.addCookie('accessToken', data.accessToken, { expires: new Date(data.expiration * 1000)});
//         return response.send();
//     }
// }

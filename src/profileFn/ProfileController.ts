import {Get, Handler, Middleware, Request, Response, ResponseBody} from 'lambda-core';
import {LOGGER} from 'logger';
// import {Security} from 'security';
import {Template} from "../template-engine/Template";
import * as path from "path";

export interface PolicyGateState {
    redirectUrl: string;
}

/** Class representing the controller for the Profile Lambda */
export class ProfileController extends Handler {
    protected middleware: Middleware[] = [];

    @Get('/profile/edit')
    /*
        Resource rendering an edit profile page
     */
    private async profileEdit(request: Request): Promise<ResponseBody> {
        LOGGER.debug('Editing profile');
        const state: string = request.getQueryParam<string>('state');
        const token: string = request.getQueryParam<string>('token');

        try {
            LOGGER.debug('QueryParams', request.getQueryParams());
            const template = await new Template(path.resolve('./src', 'views/editProfile.ejs')).render({});
            return Response.render(request).send(template);
        } catch (e) {
            LOGGER.error(e, 'ProfileEdit Route failed');
            return Response.fromError(request, e);
        }
    }

    // @Post('/profile')
    // private async saveProfile(request: Request): Promise<ResponseBody> {
    //     const code: string = request.getQueryParam<string>('code');
    //
    //     try {
    //         const policyGate = await OpenIdClient.init();
    //         const tokens: TokenSet = await policyGate.fetchTokens(code);
    //         LOGGER.debug(tokens, 'Tokens found');
    //
    //         return this.respondWithTokenCookies(request, {
    //             accessToken: tokens.access_token,
    //             expiration: tokens.claims().exp,
    //             redirectUrl: '/profile',
    //         });
    //     } catch (e) {
    //         LOGGER.error(e, 'AuthCallback Route failed');
    //         return Response.redirect(
    //             request,
    //             UrlBuilder.build(decodedState.redirectUrl, { errorMessage: e.message, errorCode: e.errorCode || ErrorCode.InternalServerError }),
    //             { cors: false },
    //         ).send();
    //     }
    // }
}

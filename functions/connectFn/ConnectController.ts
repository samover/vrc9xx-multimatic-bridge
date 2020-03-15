import {Handler, Middleware, Post, Request, Response, ResponseBody, ValidateBody} from 'lambda-core';
import {LOGGER} from 'logger';
import {encrypt, Token} from "security";
import {PostConnectRequestBody} from "./dtos/postConnectRequestBody";
import {BadRequestError, InternalServerError, UnauthorizedError} from "errors";
import { Authentication } from "vaillant-api";
import { Table } from 'dynamodb';
import uuid from 'uuid/v4';

const webUri = process.env.WEB_APP_URI;
const oauth0Uri = process.env.OAUTH0_URI;

export interface PolicyGateState {
    redirectUrl: string;
}

/** Class representing the controller for the Profile Lambda */
export class ConnectController extends Handler {
    protected middleware: Middleware[] = [];

    @Post('/connect')
    /*
        Validates entrypoint and redirects to static page
     */
    @ValidateBody(PostConnectRequestBody)
    private async postConnect(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'Entrypoint POST /connect');

        const body: PostConnectRequestBody = request.getBody<PostConnectRequestBody>();
        const token: string = request.getHeader('authorization').replace(/Bearer /, '');

        try {
            if (!body.hasAcceptedTerms) {
                throw new BadRequestError('User must accept Terms and Conditions');
            }

            // validate token
            const userInfo = await Token.verify(token);

            // Test Multimatic Connect
            const smartphoneId = uuid();
            const authentication = new Authentication({ username: body.username, smartphoneId, sessionId: null, authToken: null });
            await authentication.login(body.password);
            await authentication.authenticate();

            // Save Multimatic Credentials in dynamoDB
            const table = new Table(process.env.MULTIMATIC_TABLE);
            const secret = encrypt(JSON.stringify({
                authToken: authentication.getAuthToken(),
                sessionId: authentication.getSessionId(),
                smartphoneId,
                username: body.username,
            }));

            await table.putItem({ userId: userInfo.sub, hasAcceptedTerms: body.hasAcceptedTerms, secret: JSON.stringify(secret) });

            return Response.noContent(request).send();
        } catch (e) {
            LOGGER.error(e, 'ProfileEdit Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) errorMessage = 'Token invalid or expired';
            else if (e instanceof InternalServerError) errorMessage = 'Critical service error';
            else errorMessage = 'Invalid Multimatic Credentials';

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }
}

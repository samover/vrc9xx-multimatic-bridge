import { Table } from 'dynamodb';
import { BadRequestError, InternalServerError, UnauthorizedError } from 'errors';
import { Handler, Middleware, Post, Request, Response, ResponseBody, ValidateBody } from 'lambda-core';
import { LOGGER } from 'logger';
import { encrypt, Token } from 'security';
import uuid from 'uuid/v4';
import { Authentication } from 'vaillant-api';
import { PostConnectRequestBody } from './dtos/postConnectRequestBody';

/** Class representing the controller for the Connect Lambda */
export class ConnectController extends Handler {
    protected middleware: Middleware[] = [];

    @Post('/connect')
    @ValidateBody(PostConnectRequestBody)
    /**
     * Use for validating and storing an encrypted string of a user's vaillaint multimatic credentials
     *
     * @param {Request}
     * @param {Request.body<PostConnectRequestBody>}
     * @returns {ResponseBody}
     * @throws {BadRequestError}
     */
    private async postConnect(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'Entrypoint POST /connect');

        const body: PostConnectRequestBody = request.getBody<PostConnectRequestBody>();
        const token: string = request.getHeader('authorization').replace(/Bearer /, '');

        try {
            if (body.hasAcceptedTerms !== 'true') {
                throw new BadRequestError('User must accept Terms and Conditions');
            }

            // validate token
            const userInfo = await Token.verify(token);

            // Test Multimatic Connect
            const smartphoneId = uuid();
            const authentication = new Authentication({
                username: body.username,
                smartphoneId,
                sessionId: null,
                authToken: null
            });
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

            await table.putItem({
                userId: userInfo.sub,
                hasAcceptedTerms: body.hasAcceptedTerms,
                secret: JSON.stringify(secret)
            });

            return Response.noContent(request).send();
        } catch (e) {
            LOGGER.error(e, 'ProfileEdit Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                errorMessage = 'Token invalid or expired';
            } else if (e instanceof InternalServerError) {
                errorMessage = 'Critical service error';
            } else if (e instanceof BadRequestError) {
                errorMessage = e.message;
            } else {
                errorMessage = 'Invalid Multimatic Credentials';
            }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }
}

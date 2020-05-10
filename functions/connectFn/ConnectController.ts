import {
    Handler,
    Middleware,
    Post,
    Request,
    Response,
    ResponseBody,
    UseErrorHandler,
    ValidateBody,
} from 'aws-lambda-core';
import { BadRequestError } from 'aws-lambda-core/lib/errors';
import { LOGGER } from 'logger';
import { Token } from 'security';
import uuid from 'uuid/v4';
import { errorHandler } from './connectErrorHandler';
import { PostConnectRequestBody } from './dtos/postConnectRequestBody';
import { CredentialsService } from './services/credentialsService';

/** Class representing the controller for the Connect Lambda */
export class ConnectController extends Handler {
    protected middleware: Middleware[] = [];

    @Post('/connect')
    @ValidateBody(PostConnectRequestBody)
    @UseErrorHandler(errorHandler)
    /**
     * Use for validating and storing an encrypted string of a user's vaillaint multimatic credentials
     *
     * @param {Request}
     * @param {Request.body<PostConnectRequestBody>}
     * @returns {ResponseBody}
     * @throws {BadRequestError}
     */
    public async postConnect(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'Entrypoint POST /connect');

        const body: PostConnectRequestBody = request.getBody<PostConnectRequestBody>();
        const token: string = request.getHeader('authorization').replace(/Bearer /, '');

        if (body.hasAcceptedTerms !== 'true') {
            throw new BadRequestError('User must accept Terms and Conditions');
        }

        // validate token
        const userInfo = await Token.verify(token);

        // verify Multimatic credentials
        const smartphoneId = uuid();
        const authentication = await CredentialsService.verify(body.username, body.password, smartphoneId);

        // save Multimatic credentials
        await CredentialsService.save(authentication, userInfo.sub, body.hasAcceptedTerms);

        return Response.noContent(request).send();
    }
}

import { Context } from 'aws-lambda';
import { LOGGER } from 'logger';
import { Objects } from 'utils';
import { Handler } from './Handler';
import { LambdaProxyEvent, Request } from './Request';
import { Response } from './Response';
import { ResponseBody } from './ResponseBody';

/**
 * Represents the LambdaEntryPoint abstract class
 */
export abstract class LambdaEntryPoint {
    public handler: Handler;

    /**
     * HeartBeatResponse can be used to keep the Lambda warm using Cloudwatch Events
     */
    private static heartBeatResponse(request: Request): ResponseBody {
        LOGGER.debug('Heartbeat function');
        // Disable cors because
        return Response.noContent(request, { cors: false }).send();
    }

    /**
     * entrypoint for the Api Gateway Proxy event.
     */
    public async handle(event: LambdaProxyEvent, context: Context): Promise<ResponseBody> {
        let request: Request;
        LOGGER.debug(event, context, 'Lambda Event');

        // Makes sure that the response is sent straight away when callback is invoked
        // instead of waiting for the nodejs event loop to be empty. This is best practice
        // for nodeJS lambdas on AWS
        // See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
        // eslint-disable-next-line no-param-reassign
        if (context) { context.callbackWaitsForEmptyEventLoop = false; }

        try {
            request = new Request(event);
            LOGGER.debug(request instanceof Request, 'Entrypoint.handle: request is instanceof Request');
            LOGGER.debug(JSON.stringify(request.getResource(), null, 2), '@@@@@ RESOURCE');

            if (Objects.isEmpty(event)) {
                return LambdaEntryPoint.heartBeatResponse(request);
            }
            return await this.handleRequest(request, context);
        } catch (e) {
            LOGGER.error(e, 'Error handling request');
            return Response.fromError(request, e);
        }
    }

    /**
     * initializeHandler is used for example to open a DB connection or set up Dependency Injection
     * @returns handler Handler exposes api endpoint methods
     */
    protected abstract initializeHandler(): Promise<Handler>;

    private async handleRequest(request: Request, context: Context): Promise<ResponseBody> {
        this.handler = await this.initializeHandler();
        return this.handler.handle(request);
    }
}

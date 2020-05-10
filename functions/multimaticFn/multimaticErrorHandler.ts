import { LOGGER } from 'logger';
import {
    Response, Request, ErrorHandler, ResponseBody, apiErrors,
} from 'aws-lambda-core';

export const errorHandler: ErrorHandler = async (e: Error, request: Request, caller, klass): Promise<ResponseBody> => {
    LOGGER.error(e, `${request.getMethod().toUpperCase()} ${request.getPath()} failed`);

    if (e instanceof apiErrors.UnauthorizedError) {
        const token: string = klass.authenticationService.parseToken(request.getHeader('authorization'));
        await klass.authenticationService.reAuthenticate(token);
        return klass[caller](request);
    }

    let errorMessage = 'Invalid Multimatic Credentials';

    if (e instanceof apiErrors.InternalServerError) {
        errorMessage = 'Critical service error';
    }

    return Response.fromError(request, new apiErrors.BadRequestError(errorMessage));
};

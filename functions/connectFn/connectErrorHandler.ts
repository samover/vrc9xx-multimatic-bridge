import { BadRequestError, InternalServerError, UnauthorizedError } from 'aws-lambda-core/lib/errors';
import { LOGGER } from 'logger';
import {
    Response, Request, ErrorHandler, ResponseBody,
} from 'aws-lambda-core';

export const errorHandler: ErrorHandler = async (e: Error, request: Request): Promise<ResponseBody> => {
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
};

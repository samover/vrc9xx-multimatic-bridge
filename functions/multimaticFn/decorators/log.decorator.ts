import 'reflect-metadata';
import { ResponseBody, Request } from 'aws-lambda-core';
import { LOGGER } from 'logger';

export const log = (
    target: object, key: string|symbol, descriptor: PropertyDescriptor,
): void => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (request: Request, ...args: any[]): Promise<ResponseBody> {
        LOGGER.debug({ request }, `ENTRYPOINT for ${request.getMethod()} ${request.getResource()}`);
        return originalMethod.call(this, request, ...args);
    };
};

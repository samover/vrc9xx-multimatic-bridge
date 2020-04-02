import 'reflect-metadata';

import { ValidationClass, ValidatorOptions } from 'class-validator-wrapper';
import { ValidationError } from 'errors';
import { Request } from '../../Request';
import { RequestParams } from '../enums';

const getValidationObject = (request: Request, paramType: RequestParams): object => {
    switch (paramType) {
        case RequestParams.BODY:
            return request.getBody();
        case RequestParams.QUERY:
            return request.getQueryParams();
        case RequestParams.PATH:
            return request.getPathParams();
    }
};

export const RequestValidation = (Klass: new() => ValidationClass, paramType: RequestParams, options: RequestValidationOptions): MethodDecorator => {
    const validatorOptions: ValidatorOptions = options.allowUnknownFields
        ? { whitelist: false, forbidNonWhitelisted: false }
        : { whitelist: true, forbidNonWhitelisted: true };

    return (target, key, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async (request: Request, ...args: any[]) => {
            const klass = new Klass();
            const validationObject = getValidationObject(request, paramType);
            Object.keys(validationObject).forEach((prop: string) => {
                // @ts-ignore
                klass[prop] = validationObject[prop];
            });
            const validationResult = await klass.validate(validatorOptions);
            if (validationResult.length > 0) {
                throw new ValidationError({ validationErrors: validationResult });
            }

            return originalMethod.call(target, request, ...args);
        };
    };
};

export interface RequestValidationOptions {
    allowUnknownFields?: boolean;
}

const createMappingDecorator = (paramType: RequestParams) => (klass: new() => ValidationClass, options: RequestValidationOptions = {}): MethodDecorator => RequestValidation(klass, paramType, options);

export const ValidateBody = createMappingDecorator(RequestParams.BODY);
export const ValidateQuery = createMappingDecorator(RequestParams.QUERY);
export const ValidatePath = createMappingDecorator(RequestParams.PATH);

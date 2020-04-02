/* tslint:disable:max-classes-per-file */
import { IsNumber, IsString, ValidationClass } from 'class-validator-wrapper';
import { ValidationError as ApiValidationError } from 'errors';
import { LambdaProxyEvent, Request } from 'lambda-core';
import { ValidateBody } from '../../../../modules/lambda-core/common/decorators';
import { apiGatewayProxyEvent } from '../../../__helpers';

class Body extends ValidationClass {
    @IsString()
    // @ts-ignore
    public name: string;

    @IsNumber()
    // @ts-ignore
    public age: number;
}

const invokeStub = jest.fn();

class Klass {
    @ValidateBody(Body)
    // @ts-ignore
    public invoke(...args) {
        return invokeStub(...args);
    }
}
class Klass2 {
    @ValidateBody(Body, { allowUnknownFields: true })
    // @ts-ignore
    public invoke(...args) {
        return invokeStub(...args);
    }
}

let proxyEvent: any;

describe('Decorators#RequestValiation', () => {
    beforeEach(() => {
        proxyEvent = apiGatewayProxyEvent.get();
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('ValidateBody', () => {
        it('validates a correct body', async () => {
            const klass = new Klass();
            proxyEvent.body = { age: 123, name: 'yo' };
            const request = new Request(proxyEvent);
            await klass.invoke(request, '123', true, [1, 2, 3]);
            expect(invokeStub).toHaveBeenCalledWith(request, '123', true, [1,2,3]);
        });

        it('throws when passing unknown property by default', async () => {
            const klass = new Klass();
            proxyEvent.body = { age: 123, name: 'yo', unknown: 'value' };
            await expect(klass.invoke(new Request(proxyEvent))).rejects.toBeInstanceOf(ApiValidationError);
            expect(invokeStub).not.toHaveBeenCalled();
        });

        it('does not throw when passing unknown property if options is passed', async () => {
            const klass = new Klass2();
            proxyEvent.body = { age: 123, name: 'yo', unknown: 'value' };
            const request = new Request(proxyEvent);
            await klass.invoke(request);
            expect(invokeStub).toHaveBeenCalledWith(request);
        });

        it('invalidates an incorrect body', async () => {
            const klass = new Klass();
            proxyEvent.body = { age: 'oops', name: 'yo', stuff: 'hello' };
            await expect(klass.invoke(new Request(proxyEvent))).rejects.toBeInstanceOf(ApiValidationError);
            expect(invokeStub).not.toHaveBeenCalled();
        });
    })
});

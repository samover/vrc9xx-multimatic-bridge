/* tslint:disable:max-classes-per-file */

import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import { IsNumber, IsString, validate, ValidationClass, ValidationError, ValidatorOptions } from '@jmc/class-validator';
import { ValidationError as ApiValidationError } from '@jmc/errors';
import { RequestValidationOptions, ValidateBody } from '../../src/common/decorators';
import { Request } from '../../src/Request';

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
    public invoke(...args) {
        return invokeStub(...args);
    }
}
class Klass2 {
    @ValidateBody(Body, { allowUnknownFields: true })
    public invoke(...args) {
        return invokeStub(...args);
    }
}

describe('Decorators#RequestValiation', () => {
    beforeEach(() => {
        this.proxyEvent = apiGatewayProxyEvent.get();
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('ValidateBody', () => {
        it('validates a correct body', async () => {
            const klass = new Klass();
            this.proxyEvent.body = { age: 123, name: 'yo' };
            const request = new Request(this.proxyEvent);
            await klass.invoke(request, '123', true, [1,2,3]);
            expect(invokeStub).toHaveBeenCalledWith(request, '123', true, [1,2,3]);
        });

        it('throws when passing unknown property by default', async () => {
            const klass = new Klass();
            this.proxyEvent.body = { age: 123, name: 'yo', unknown: 'value' };
            await expect(klass.invoke(new Request(this.proxyEvent))).rejects.toBeInstanceOf(ApiValidationError);
            expect(invokeStub).not.toHaveBeenCalled();
        });

        it('does not throw when passing unknown property if options is passed', async () => {
            const klass = new Klass2();
            this.proxyEvent.body = { age: 123, name: 'yo', unknown: 'value' };
            const request = new Request(this.proxyEvent);
            await klass.invoke(request);
            expect(invokeStub).toHaveBeenCalledWith(request);
        });

        it('invalidates an incorrect body', async () => {
            const klass = new Klass();
            this.proxyEvent.body = { age: 'oops', name: 'yo', stuff: 'hello' };
            await expect(klass.invoke(new Request(this.proxyEvent))).rejects.toBeInstanceOf(ApiValidationError);
            expect(invokeStub).not.toHaveBeenCalled();
        });
    })
});

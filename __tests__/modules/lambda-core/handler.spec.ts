import { apiGatewayProxyEvent } from '@jmc-dev/test-helper';
import 'reflect-metadata';
import { Authenticated, Get, LambdaProxyEvent, Request, ResponseBody } from '../src';
import { Handler, Middleware, Routes } from '../src/Handler';

const getProfileStub = jest.fn();

class HandlerImplementation extends Handler {
    protected middleware: Middleware[];

    // @ts-ignore
    @Get('/profile/{id}')
    // @ts-ignore
    @Authenticated()
    // @ts-ignore
    public async getProfile(req: Request) {
        return getProfileStub(req);
    }
}

let handlerImplementation;
let event;
let request;

describe('Handler', () => {
    beforeEach(() => {
        handlerImplementation = new HandlerImplementation();
        event = apiGatewayProxyEvent.get() as unknown as LambdaProxyEvent;
        event.httpMethod = 'GET';
        event.resource = '/profile/{id}';
        request = new Request(event);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('is an abstract class that needs extending', () => {
        expect(handlerImplementation).toBeInstanceOf(Handler);
    });

    describe('#handle', () => {
        it('returns 500 response when Routepath is unknown', async () => {
            const path = 'GET_PROFILE';
            event.httpMethod = 'PATCH';
            request = new Request(event);
            const response = await handlerImplementation.handle(request);
            expect(response.statusCode).toEqual(500);
        });
        it('invokes correct path', async () => {
            const response = await handlerImplementation.handle(request);
            expect(getProfileStub).toHaveBeenCalledTimes(1);
            expect(getProfileStub).toHaveBeenCalledWith(request);
        });
        it('applies middleware and continues to correct path if middleware does not contain response', async () => {
            const middlewareMock = jest.fn().mockResolvedValue('OK');
            handlerImplementation.middleware.push(middlewareMock);
            const response = await handlerImplementation.handle(request);
            expect(middlewareMock).toHaveBeenCalledTimes(1);
            expect(middlewareMock).toHaveBeenCalledWith(request, handlerImplementation.getRouteConfig(request));
            expect(getProfileStub).toHaveBeenCalledTimes(1);
            expect(getProfileStub).toHaveBeenCalledWith(request);
        });
        it('applies middleware and returns middleware ApiResponse', async () => {
            const middlewareMock = jest.fn().mockResolvedValue(new ResponseBody({ statusCode: 406 }));
            handlerImplementation.middleware.push(middlewareMock);
            const response = await handlerImplementation.handle(request);
            expect(middlewareMock).toHaveBeenCalledTimes(1);
            expect(middlewareMock).toHaveBeenCalledWith(request, handlerImplementation.getRouteConfig(request));
            expect(getProfileStub).not.toHaveBeenCalled();
            expect(response.statusCode).toEqual(406);
        });
    });

    describe('#getRouteConfig', () => {
        it('parses a routeConfig from a request', () => {
            const path = 'GET_PROFILE';
            const route = handlerImplementation.getRouteConfig(request);

            expect(route.authenticated).toEqual(true);
            expect(route.method).toEqual('GET');
            expect(route.name).toEqual('getProfile');
            expect(route.path).toEqual('/profile/{id}');
        });
        it('returns Undefined Route error when METHOD + PATH is not in routeConfig', () => {
            event.httpMethod = 'PATCH';
            request = new Request(event);
            expect(() => handlerImplementation.getRouteConfig(request)).toThrow('Route undefined');
        });
        it('returns Undefined Route error when METHOD is missing', () => {
            delete request.method;
            expect(() => handlerImplementation.getRouteConfig(request)).toThrow('Route undefined');
        });
        it('returns Undefined Route error when PATH is missing', () => {
            event.httpMethod = 'PATCH';
            request = new Request(event);
            expect(() => handlerImplementation.getRouteConfig(request)).toThrow('Route undefined');
        })
    });
});

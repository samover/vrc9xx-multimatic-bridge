import { LOGGER } from '../logger';
import { Promises } from '../utils';
import camelCase from 'lodash.camelcase';
import { ROUTES_METADATA } from './common/constants';
import { HttpMethod } from './common/types';
import { Request } from './Request';
import { Response } from './Response';
import { ResponseBody } from './ResponseBody';

function equals(actual: string, check: string): boolean {
    return actual.trim().toUpperCase() === check.trim().toUpperCase();
}

export interface HandlerAction {
    /** Corresponds to the api method in the handler */
    name: string;
    /** Resource path, e.g. /users/{id}/profile */
    path: string;
    method: HttpMethod;
    /** Is the endpoint authenticated? */
    authenticated: boolean;
    /** Do we need to check for a session token */
    useSession: boolean;
    /** Which roles are allowed to consume the endpoint? */
    roles: string[];
}

export interface RouteConfig {
    path: string
    method: HttpMethod;
    authenticated: boolean;
    useSession: boolean;
    roles?: string[];
}
export interface Routes {
    [key: string]: RouteConfig;
}

interface HandlerInterface {
    [key: string]: (request: Request) => Promise<ResponseBody>;
}

export type Middleware = (request: Request, action: HandlerAction) => Promise<void | ResponseBody>;

export abstract class Handler implements HandlerInterface {
    [key: string]: any;
    /**
     * Middleware is executed before the handler code. There are two types of middleware:
     *
     * 1) middleware that modifies the request object (express.js like functionality)
     * 2) middleware that returns a [[ResponseBody]] and interrupts the flow
     *
     * @protected
     * @abstract
     * @type {Middleware[]}
     * @memberOf Handler
     */
    protected abstract middleware: Middleware[] = [];
    protected action: HandlerAction;

    /**
     * Parses the action from the request, executes the middleware
     * and invokes the correct action on the handler implementation.
     */
    public async handle(request: Request): Promise<ResponseBody> {
        try {
            LOGGER.debug('Handling request', JSON.stringify(request, null, 2));
            this.action = this.getRouteConfig(request);
            const middlewareResponse = await Promises.resolvePromiseChain(this.middleware.map((middleware: Middleware) => () => middleware(request, this.action)));
            const prematureResponse = middlewareResponse.find((resp: any) => resp instanceof ResponseBody);
            if (prematureResponse) {
                return prematureResponse;
            }

            return this[this.action.name](request);
        } catch (e) {
            LOGGER.error(e, 'Something went wrong');
            return Response.fromError(request, e);
        }
    }

    /**
     * Parses [[HandlerAction]] from request
     * @throws {Error} Unknown Route error
     */
    protected getRouteConfig(request: Request): HandlerAction {
        LOGGER.debug('@@@@@ REQUEST 123', request);
        const path: string = request.getResource();
        const method: HttpMethod = request.getMethod();
        LOGGER.debug({
            request: `${method} ${path}`,
            // tslint:disable-next-line:object-literal-sort-keys
            headers: request.getHeaders(),
            body: request.getBody(),
            params: request.getPathParams(),
            query: request.getQueryParams(),
            identity: request.getIdentity(),
        }, 'AUDIT');

        if (!path || !method) {
            throw new Error('Route undefined');
        }

        const routesMetadata = Reflect.getMetadata(ROUTES_METADATA, this) as Routes;
        const routeName: string = Object.keys(routesMetadata)
            .find(a => equals(path, routesMetadata[a].path) && equals(method, routesMetadata[a].method));
        if (!routeName) {
            throw new Error('Route undefined');
        }

        const requestedAction: RouteConfig = routesMetadata[routeName];


        return {
            authenticated: requestedAction.authenticated,
            method,
            name: camelCase(routeName),
            path,
            roles: requestedAction.roles || [],
            useSession: requestedAction.useSession,
        };
    }
}

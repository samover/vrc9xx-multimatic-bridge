import 'reflect-metadata';

import { ROUTES_METADATA } from '../constants';

export const UseSession = (useSession: boolean = true): MethodDecorator => {
    return (target, key, descriptor: PropertyDescriptor) => {
        const routes = Reflect.getMetadata(ROUTES_METADATA, target) || {};
        if (!routes[key]) { routes[key] = {}; }
        routes[key].useSession = useSession;
        Reflect.defineMetadata(ROUTES_METADATA, routes, target);

        return descriptor;
    };
};

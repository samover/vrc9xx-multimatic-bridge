import 'reflect-metadata';

export const mockSessionId = process.env.DEMO_SESSION_ID;

/**
 * Mock Decorator. Allows for testing of a demo account necessary for a.o. AWS skill approval
 * @param mockObject
 */
export const mock = (mockObject: any) => (
    target: object, key: string|symbol, descriptor: PropertyDescriptor,
): void => {
    const originalMethod = descriptor.value;
    const mockFunction = async (id: string): Promise<object> => {
        if (id && mockObject) return mockObject.find((obj: { [key: string]: object }) => obj[id]);
        return mockObject;
    };

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (...args: any[]): Promise<object> {
        if (this.sessionId === mockSessionId) return mockFunction.call(this, ...args);
        return originalMethod.call(this, ...args);
    };
};

export const mockLogin = (
    target: object, key: string|symbol, descriptor: PropertyDescriptor,
): void => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (password: string): Promise<void> {
        if (this.username === process.env.DEMO_USERNAME && password === process.env.DEMO_PASSWORD) {
            this.authToken = process.env.DEMO_AUTH_TOKEN;
            return Promise.resolve();
        }
        return originalMethod.call(this, password);
    };
};

export const mockAuthenticate = (
    target: object, key: string|symbol, descriptor: PropertyDescriptor,
): void => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (...args: any[]): Promise<void> {
        if (this.authToken === process.env.DEMO_AUTH_TOKEN) {
            this.sessionId = mockSessionId;
            return Promise.resolve();
        }
        return originalMethod.call(this, ...args);
    };
};

export interface AlexaHeader {
    namespace: string;
    name: string;
    payloadVersion: string;
    messageId: string;
    correlationToken: string;
}

export interface Scope {
    type: string;
    token: string;
}

export interface Endpoint {
    scope: Scope;
    endpointId: string;
    cookie: any;
}

export interface Payload {
    scope: Scope;
    [key: string]: any;
}

export interface AlexaEvent {
    header: AlexaHeader;
    endpoint: Endpoint;
    payload: Payload;
}

export interface AlexaRequestDirective {
    directive: AlexaEvent;
}

export interface ContextProperty {
    namespace: string;
    instance?: string;
    name: string;
    value: string | { value: number | string; scale?: string };
    timeOfSample: string;
    uncertaintyInMilliseconds: number;
}

export interface AlexaResponseEvent {
    event: AlexaEvent;
    context?: {
        properties: ContextProperty[];
    };
}

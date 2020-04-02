import { AlexaEvent, AlexaRequestDirective, AlexaResponseEvent } from '../common/interfaces/alexaEvent.interface';
import { AlexaContext } from '../common/interfaces/alexaContext.interface';

export abstract class AbstractDirective {
    protected event: AlexaEvent;

    private responseEvent: AlexaEvent;

    private responseContext: any;

    constructor(event: AlexaEvent) {
        this.event = event;
        this.responseEvent = event;
    }

    protected updateResponseHeader(name: string, namespace?: string): void {
        this.responseEvent.header.name = name;
        if (namespace) this.responseEvent.header.namespace = namespace;
    }

    protected addPayload(payload: any): void {
        this.responseEvent.payload = payload;
    }

    protected addContext(context: any): void {
        this.responseContext = context;
    }

    protected getResponse(): AlexaResponseEvent {
        return { event: this.responseEvent, context: this.responseContext };
    }

    abstract async handle(): Promise<{ event: AlexaEvent }>;
}

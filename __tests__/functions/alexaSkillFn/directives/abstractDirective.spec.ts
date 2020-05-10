import * as faker from 'faker';
import {
    AlexaEvent,
    AlexaResponseEvent
} from '../../../../functions/alexaSkillFn/common/interfaces/alexaEvent.interface';
import { AbstractDirective } from '../../../../functions/alexaSkillFn/directives/AbstractDirective';

const alexaEvent: AlexaEvent = {
    header: {
        namespace: null,
        name: null,
        payloadVersion: null,
        messageId: null,
        correlationToken: null,
    },
    endpoint: null,
    payload: null,
};

class DirectiveMock extends AbstractDirective {
    public event: AlexaEvent;

    async handle(): Promise<{ event: AlexaEvent }> {
        return undefined;
    }

    public updateResponseHeader(name: string, namespace?: string): void {
        super.updateResponseHeader(name, namespace);
    }

    public addPayload(payload: any): void {
        super.addPayload(payload);
    }

    public addContext(context: any): void {
        super.addContext(context);
    }

    public getResponse(): AlexaResponseEvent {
        return super.getResponse();
    }
}

describe('AbstractDirective', () => {
    describe('#updateResponseHeader', () => {
        it('adds name & namespace to responseEvent header', () => {
            const name = faker.lorem.word();
            const namespace = faker.lorem.word();
            const directive = new DirectiveMock(alexaEvent);

            directive.updateResponseHeader(name, namespace);

            const response = directive.getResponse();

            expect(response.event.header.name).toEqual(name);
            expect(response.event.header.namespace).toEqual(namespace);
        });
    });
    describe('#addPayload', () => {
        it('adds payload to responseEvent', () => {
            const payload = faker.lorem.word();
            const directive = new DirectiveMock(alexaEvent);

            directive.addPayload(payload);

            const response = directive.getResponse();

            expect(response.event.payload).toEqual(payload);
        });
    });
    describe('#addContext', () => {
        it('adds context to responseContect', () => {
            const context = faker.lorem.word();
            const directive = new DirectiveMock(alexaEvent);

            directive.addContext(context);

            const response = directive.getResponse();

            expect(response.context).toEqual(context);
        });
    });
    describe('#getResponse', () => {
        it('returns response containing responseEvent and responseContext', () => {
            const context = faker.lorem.word();
            const directive = new DirectiveMock(alexaEvent);

            directive.addContext(context);

            const response = directive.getResponse();

            expect(response.context).toEqual(context);
            expect(response.event).toEqual(alexaEvent);
        });
    });
});

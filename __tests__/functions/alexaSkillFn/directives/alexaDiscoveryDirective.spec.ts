import * as faker from "faker";
import {
    NAMESPACES,
    REQUESTS,
    RESPONSES
} from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';
import { AlexaEvent } from '../../../../functions/alexaSkillFn/common/interfaces/alexaEvent.interface';
import { AlexaDiscoveryDirective } from '../../../../functions/alexaSkillFn/directives/AlexaDiscoveryDirective';
import * as multimaticApi from '../../../../functions/alexaSkillFn/multimatic-api';

jest.mock('../../../../functions/alexaSkillFn/multimatic-api');

const facilityId = faker.random.uuid();
const roomId = faker.random.uuid();
const token = faker.internet.password(25);

const buildAlexaEvent = (): AlexaEvent => ({
    header: {
        namespace: NAMESPACES.AlexaDiscovery,
        name: REQUESTS.Discover,
        payloadVersion: null,
        messageId: null,
        correlationToken: null,
    },
    endpoint: null,
    payload: {
        scope: {
            token: token,
            type: 'Bearer',
        }
    },
});

describe('AlexaDiscoveryDirect', () => {
    let directive: AlexaDiscoveryDirective;
    const system = {
        zones: ['zone'],
        rooms: ['room'],
    };
    const multimaticApiMockImplementation = {
        addToken: jest.fn(),
        get: jest.fn(),
    };
    const propertiesBuilderMockImplementation = {
        build: jest.fn(),
    };

    beforeEach(() => {
        // @ts-ignore
        multimaticApi.Systems.mockImplementation(() => multimaticApiMockImplementation);
    });

    describe('#handle', () => {
        beforeEach(() => {
            multimaticApiMockImplementation.get.mockResolvedValue([system]);
            directive = new AlexaDiscoveryDirective(buildAlexaEvent());
            // @ts-ignore
            directive.zoneEndpointsBuilder.build = jest.fn();
            // @ts-ignore
            directive.roomEndpointsBuilder.build = jest.fn();
            // @ts-ignore
            directive.systemEndpointsBuilder.build = jest.fn();
        });
        it('fetches all user\'s systems', async () => {
            await directive.handle();

            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
        });

        it('builds zone endpoints', async () => {
            // @ts-ignore
            directive.zoneEndpointsBuilder.build.mockReturnValue('zoneEndpoint');

            await directive.handle();

            // @ts-ignore
            expect(directive.zoneEndpointsBuilder.build).toHaveBeenCalledWith('zone');
        });

        it('builds room endpoints', async () => {
            // @ts-ignore
            directive.roomEndpointsBuilder.build.mockReturnValue('roomEndpoint');

            await directive.handle();

            // @ts-ignore
            expect(directive.roomEndpointsBuilder.build).toHaveBeenCalledWith('room');
        });
        it('builds systems endpoints', async () => {
            // @ts-ignore
            directive.systemEndpointsBuilder.build.mockReturnValue('systemEndpoint');

            await directive.handle();

            // @ts-ignore
            expect(directive.systemEndpointsBuilder.build).toHaveBeenCalledWith(system);
        });
        it('returns Alexa Event Response including device endpoints', async () => {
            const alexaEvent = buildAlexaEvent();
            directive = new AlexaDiscoveryDirective(alexaEvent);

            // @ts-ignore
            directive.systemEndpointsBuilder.build = jest.fn().mockReturnValue('systemEndpoint');
            // @ts-ignore
            directive.roomEndpointsBuilder.build = jest.fn().mockReturnValue('roomEndpoint');
            // @ts-ignore
            directive.zoneEndpointsBuilder.build = jest.fn().mockReturnValue('zoneEndpoint');

            await expect(directive.handle()).resolves.toEqual({
                context: undefined,
                event: {
                    ...alexaEvent,
                    header: {...alexaEvent.header, name: RESPONSES.Discover},
                    payload: { endpoints: ['systemEndpoint', 'roomEndpoint', 'zoneEndpoint'] },
                },
            });
        });
    });
});

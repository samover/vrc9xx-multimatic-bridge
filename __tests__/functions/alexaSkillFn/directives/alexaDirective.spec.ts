import * as faker from 'faker';
import { REQUESTS, RESPONSES } from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';
import { AlexaEvent } from '../../../../functions/alexaSkillFn/common/interfaces/alexaEvent.interface';
import { AlexaDirective } from '../../../../functions/alexaSkillFn/directives/AlexaDirective';
import * as multimaticApi from '../../../../functions/alexaSkillFn/multimatic-api';

jest.mock('../../../../functions/alexaSkillFn/multimatic-api');

const facilityId = faker.random.uuid();
const roomId = faker.random.uuid();
const token = faker.internet.password(25);

const buildAlexaEvent = (type: string, id: string): AlexaEvent => ({
    header: {
        namespace: null,
        name: REQUESTS.ReportState,
        payloadVersion: null,
        messageId: null,
        correlationToken: null,
    },
    endpoint: {
        endpointId: `${facilityId}:${type}:${id}`,
        scope: {
            token: token,
            type: 'Bearer',
        },
        cookie: null,
    },
    payload: null,
});

describe('AlexaDirective', () => {
    const multimaticApiMockImplementation = {
        addToken: jest.fn(),
        get: jest.fn(),
    };
    const propertiesBuilderMockImplementation = {
        build: jest.fn(),
    };

    beforeEach(() => {
        // @ts-ignore
        multimaticApi.Room.mockImplementation(() => multimaticApiMockImplementation);
        // @ts-ignore
        multimaticApi.System.mockImplementation(() => multimaticApiMockImplementation);
        // @ts-ignore
        multimaticApi.Zone.mockImplementation(() => multimaticApiMockImplementation);
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#handleRoom', () => {
        let directive: AlexaDirective;
        let alexaEvent: AlexaEvent;
        let roomId: string = faker.random.uuid();

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('room', roomId);
            directive = new AlexaDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('room');
        });
        it('fetches the room from the multimatic api', async () => {
            await directive.handle();

            expect(multimaticApi.Room).toHaveBeenCalledWith(facilityId, roomId);
            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(alexaEvent.endpoint.scope.token);
        });
        it('builds the roomProperties', async () => {
            await directive.handle();

            expect(propertiesBuilderMockImplementation.build).toHaveBeenCalledWith('room');
        });
        it('returns an Room StateReport response', async () => {
            await expect(directive.handle()).resolves.toEqual({
                context: { properties: 'roomProperties' },
                event: { ...alexaEvent, header: { ...alexaEvent.header, name: RESPONSES.ReportState } },
            });
        });
    });

    describe('#handleZone', () => {
        let directive: AlexaDirective;
        let alexaEvent: AlexaEvent;
        let zoneId: string = faker.random.uuid();

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('zone', zoneId);
            directive = new AlexaDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('zone');
        });
        it('fetches the zone from the multimatic api', async () => {
            await directive.handle();

            expect(multimaticApi.Zone).toHaveBeenCalledWith(facilityId, zoneId);
            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(alexaEvent.endpoint.scope.token);
        });
        it('builds the zoneProperties', async () => {
            await directive.handle();

            expect(propertiesBuilderMockImplementation.build).toHaveBeenCalledWith('zone');
        });
        it('returns an Zone StateReport response', async () => {
            await expect(directive.handle()).resolves.toEqual({
                context: { properties: 'zoneProperties' },
                event: { ...alexaEvent, header: { ...alexaEvent.header, name: RESPONSES.ReportState } },
            });
        });
    });

    describe('#handleSystem', () => {
        let directive: AlexaDirective;
        let alexaEvent: AlexaEvent;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('system', faker.random.uuid());
            directive = new AlexaDirective(alexaEvent);
            // @ts-ignore
            directive.systemStatusPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('systemProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('system');
        });
        it('fetches the system from the multimatic api', async () => {
            await directive.handle();

            expect(multimaticApi.System).toHaveBeenCalledWith(facilityId);
            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(alexaEvent.endpoint.scope.token);
        });
        it('builds the systemProperties', async () => {
            await directive.handle();

            expect(propertiesBuilderMockImplementation.build).toHaveBeenCalledWith('system');
        });
        it('returns an System StateReport response', async () => {
            await expect(directive.handle()).resolves.toEqual({
                context: { properties: 'systemProperties' },
                event: { ...alexaEvent, header: { ...alexaEvent.header, name: RESPONSES.ReportState } },
            });
        });
    });
    describe('#handle unknown', () => {
        it('returns null properties when type is unknown', async () => {
            const alexaEvent = buildAlexaEvent('unknown', faker.random.uuid());
            const directive = new AlexaDirective(alexaEvent);

            await expect(directive.handle()).resolves.toEqual({
                context: { properties: null },
                event: { ...alexaEvent, header: { ...alexaEvent.header, name: RESPONSES.ReportState } },
            });
        });
        it(`returns null when Directive is not of type ${REQUESTS.ReportState}`, async () => {
            const alexaEvent = buildAlexaEvent('unknown', faker.random.uuid());
            alexaEvent.header.name = REQUESTS.Discover;
            const directive = new AlexaDirective(alexaEvent);

            await expect(directive.handle()).resolves.toBeNull();
        });
    })
});

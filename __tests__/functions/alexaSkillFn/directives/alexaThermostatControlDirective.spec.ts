import * as duration from 'duration-fns';
import * as faker from 'faker';
import {
    NAMESPACES,
    REQUESTS,
    RESPONSES
} from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';
import { THERMOSTAT } from '../../../../functions/alexaSkillFn/common/constants/thermostat.constants';
import { AlexaEvent } from '../../../../functions/alexaSkillFn/common/interfaces/alexaEvent.interface';
import { AlexaThermostatControlDirective } from '../../../../functions/alexaSkillFn/directives/AlexaThermostatControlDirective';
import * as multimaticApi from '../../../../functions/alexaSkillFn/multimatic-api';

jest.mock('../../../../functions/alexaSkillFn/multimatic-api');

const facilityId = faker.random.uuid();
const roomId = faker.random.uuid();
const zoneId = faker.random.uuid();
const token = faker.internet.password(25);
const durationString = duration.toString({ hours: 1, minutes: 30 });
const durationMinutes = 90;

const buildAlexaEvent = (type, id, eventName, payload): AlexaEvent => ({
    header: {
        namespace: NAMESPACES.AlexaDiscovery,
        name: eventName,
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
    payload: payload,
});

describe('AlexaThermostatControlDirective', () => {
    const system = {
        zones: ['zone'],
        rooms: ['room'],
    };
    const multimaticApiMockImplementation = {
        addToken: jest.fn(),
        get: jest.fn(),
        setTemperature: jest.fn(),
        resetSchedule: jest.fn(),
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

    describe('setRoomTargetTemperature', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('room', roomId, REQUESTS.SetTargetTemperature, {
                targetSetpoint: { value: 20 }, schedule: { duration: durationString } },
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('room');
        });
        it('calls the vaillant api to set the room temperature', async () => {
            await directive.handle();

            expect(multimaticApi.Room).toHaveBeenCalledWith(facilityId, roomId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(20, 90);
        });

        it('calls the vaillant api to set the room temperature for a default duration', async () => {
            alexaEvent = buildAlexaEvent('room', roomId, REQUESTS.SetTargetTemperature, {
                    targetSetpoint: {value: 20}
                }
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            await directive.handle();

            expect(multimaticApi.Room).toHaveBeenCalledWith(facilityId, roomId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(20, THERMOSTAT.DefaultDurationInMinutes);
        });

        it('calls the vaillant api to fetch the updated room', async () => {
            const alexaEvent = buildAlexaEvent(
                'room',
                roomId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('room');

            const response = await directive.handle();

            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
        });

        it('builds room properties', async () => {
            const alexaEvent = buildAlexaEvent(
                'room',
                roomId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('room');

            const response = await directive.handle();

            expect(propertiesBuilderMockImplementation.build).toHaveBeenCalledWith('room');
        });

        it('responds with the ResponseEvent containing roomProperties', async () => {
            const alexaEvent = buildAlexaEvent(
                'room',
                roomId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('room');

            const response = await directive.handle();

            expect(response.context.properties).toEqual('roomProperties');
            expect(response.event.header.name).toEqual(RESPONSES.Response);
            expect(response.event.header.namespace).toEqual(NAMESPACES.Alexa);
        });
    });
    describe('adjustRoomTargetTemperature', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;
        let temperatureSetpoint = 20;
        let temperatureDelta = 2;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('room', roomId, REQUESTS.AdjustTargetTemperature, {
                    targetSetpointDelta: { value: temperatureDelta },
                }
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue({ temperatureSetpoint });
        });
        it('calls the vaillant api to adjust the room temperature to the requested delta', async () => {
            await directive.handle();

            expect(multimaticApi.Room).toHaveBeenCalledWith(facilityId, roomId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(
                temperatureDelta + temperatureSetpoint,
                THERMOSTAT.DefaultDurationInMinutes,
            );
        });

    });
    describe('resumeRoomSchedule', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;
        let temperatureSetpoint = 20;
        let temperatureDelta = 2;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('room', roomId, REQUESTS.ResumeSchedule, {});
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.roomPropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('roomProperties');
            multimaticApiMockImplementation.get.mockResolvedValue({ temperatureSetpoint });
        });
        it('calls the vaillant api to resume the room schedule', async () => {
            await directive.handle();

            expect(multimaticApi.Room).toHaveBeenCalledWith(facilityId, roomId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.resetSchedule).toHaveBeenCalled();
        });
    });
    describe('resumeZoneSchedule', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;
        let temperatureSetpoint = 20;
        let temperatureDelta = 2;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('zone', zoneId, REQUESTS.ResumeSchedule, {});
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue({ temperatureSetpoint });
        });
        it('calls the vaillant api to resume the zone schedule', async () => {
            await directive.handle();

            expect(multimaticApi.Zone).toHaveBeenCalledWith(facilityId, zoneId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.resetSchedule).toHaveBeenCalled();
        });
    });
    describe('adjustZoneTargetTemperature', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;
        let temperatureSetpoint = 20;
        let temperatureDelta = 2;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('zone', zoneId, REQUESTS.AdjustTargetTemperature, {
                    targetSetpointDelta: { value: temperatureDelta },
                }
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue({ temperatureSetpoint });
        });
        it('calls the vaillant api to adjust the zone temperature to the requested delta', async () => {
            await directive.handle();

            expect(multimaticApi.Zone).toHaveBeenCalledWith(facilityId, zoneId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(
                temperatureDelta + temperatureSetpoint,
                THERMOSTAT.DefaultDurationInMinutes,
            );
        });

    });
    describe('setZoneTargetTemperature', () => {
        let alexaEvent: any;
        let directive: AlexaThermostatControlDirective;

        beforeEach(() => {
            alexaEvent = buildAlexaEvent('zone', zoneId, REQUESTS.SetTargetTemperature, {
                targetSetpoint: { value: 20 }, schedule: { duration: durationString } },
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('zone');
        });
        it('calls the vaillant api to set the zone temperature', async () => {
            await directive.handle();

            expect(multimaticApi.Zone).toHaveBeenCalledWith(facilityId, zoneId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(20, 90);
        });

        it('calls the vaillant api to set the zone temperature for a default duration', async () => {
            alexaEvent = buildAlexaEvent('zone', zoneId, REQUESTS.SetTargetTemperature, {
                    targetSetpoint: {value: 20}
                }
            );
            directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            await directive.handle();

            expect(multimaticApi.Zone).toHaveBeenCalledWith(facilityId, zoneId);
            expect(multimaticApiMockImplementation.addToken).toHaveBeenCalledWith(token);
            expect(multimaticApiMockImplementation.setTemperature).toHaveBeenCalledWith(20, THERMOSTAT.DefaultDurationInMinutes);
        });

        it('calls the vaillant api to fetch the updated zone', async () => {
            const alexaEvent = buildAlexaEvent(
                'zone',
                zoneId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('zone');

            const response = await directive.handle();

            expect(multimaticApiMockImplementation.get).toHaveBeenCalled();
        });

        it('builds zone properties', async () => {
            const alexaEvent = buildAlexaEvent(
                'zone',
                zoneId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('zone');

            const response = await directive.handle();

            expect(propertiesBuilderMockImplementation.build).toHaveBeenCalledWith('zone');
        });

        it('responds with the ResponseEvent containing zoneProperties', async () => {
            const alexaEvent = buildAlexaEvent(
                'zone',
                zoneId,
                REQUESTS.SetTargetTemperature,
                { targetSetpoint: { value: 20 }, schedule: { duration: durationString } } );
            const directive = new AlexaThermostatControlDirective(alexaEvent);
            // @ts-ignore
            directive.zonePropertiesBuilder = propertiesBuilderMockImplementation;
            propertiesBuilderMockImplementation.build.mockReturnValue('zoneProperties');
            multimaticApiMockImplementation.get.mockResolvedValue('zone');

            const response = await directive.handle();

            expect(response.context.properties).toEqual('zoneProperties');
            expect(response.event.header.name).toEqual(RESPONSES.Response);
            expect(response.event.header.namespace).toEqual(NAMESPACES.Alexa);
        });
    });
});

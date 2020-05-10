import { roomModel } from '../../../__helpers/fixtures';
import { parseThermostatMode } from '../../../../functions/alexaSkillFn/builders/builderHelpers';
import { RoomPropertiesBuilder } from '../../../../functions/alexaSkillFn/builders/RoomPropertiesBuilder';

describe('RoomPropertiesBuilder', () => {
    const now = new Date();

    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(global, 'Date').mockImplementation(() => now);
    });
    afterAll(() => jest.restoreAllMocks());

    it('builds roomProperties', () => {
        const room = roomModel.build();

        // @ts-ignore
        expect(new RoomPropertiesBuilder().build(room)).toEqual([
            {
                namespace: 'Alexa.ThermostatController',
                name: 'targetSetpoint',
                value: {
                    value: room.temperatureSetpoint,
                    scale: 'CELSIUS'
                },
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.ThermostatController',
                name: 'thermostatMode',
                value: parseThermostatMode(room.operationMode),
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.TemperatureSensor',
                name: 'temperature',
                value: {
                    value: room.currentTemperature,
                    scale: 'CELSIUS'
                },
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.EndpointHealth',
                name: 'connectivity',
                value: {
                    value: 'OK'
                },
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            }
        ])
    });
});

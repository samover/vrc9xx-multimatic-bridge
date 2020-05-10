import { zoneModel } from 'fixtures';
import { parseThermostatMode } from '../../../../functions/alexaSkillFn/builders/builderHelpers';
import { ZonePropertiesBuilder } from '../../../../functions/alexaSkillFn/builders/ZonePropertiesBuilder';

describe('ZonePropertiesBuilder', () => {
    const now = new Date();

    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(global, 'Date').mockImplementation(() => now);
    });
    afterAll(() => jest.restoreAllMocks());

    it('builds zoneProperties', () => {
        const zone = zoneModel.build();

        expect(new ZonePropertiesBuilder().build(zone)).toEqual([
            {
                namespace: 'Alexa.ThermostatController',
                name: 'thermostatMode',
                value: parseThermostatMode(zone.mode),
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.TemperatureSensor',
                name: 'temperature',
                value: {
                    value: zone.insideTemperature,
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

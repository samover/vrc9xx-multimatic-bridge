import { systemStatusModel } from '../../../__helpers/fixtures';
import { parseQuickmodeValue } from '../../../../functions/alexaSkillFn/builders/builderHelpers';
import { SystemStatusPropertiesBuilder } from '../../../../functions/alexaSkillFn/builders/SystemStatusPropertiesBuilder';
import { MODE_CONTROLLER_VALUES } from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';

describe('SystemStatusPropertiesBuilder', () => {
    const now = new Date();

    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(global, 'Date').mockImplementation(() => now);
    });
    afterAll(() => jest.restoreAllMocks());

    it('builds systemStatusProperties', () => {
        const systemStatus = systemStatusModel.build();

        // @ts-ignore
        expect(new SystemStatusPropertiesBuilder().build(systemStatus)).toEqual([
            {
                namespace: 'Alexa.ModeController',
                instance: 'Thermostat.QuickMode',
                name: 'Thermostat Override',
                value: parseQuickmodeValue(systemStatus.systemOverride),
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.ModeController',
                instance: 'Thermostat.EcoMode',
                name: 'Eco Mode',
                value: systemStatus.ecoMode ? MODE_CONTROLLER_VALUES.EcoModeOn : MODE_CONTROLLER_VALUES.EcoModeOff,
                timeOfSample: now.toISOString(),
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: 'Alexa.TemperatureSensor',
                name: 'Outside Temperature',
                value: {
                    value: systemStatus.outsideTemperature,
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

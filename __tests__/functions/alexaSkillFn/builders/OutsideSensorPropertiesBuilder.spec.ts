import { systemStatusModel } from '../../../__helpers/fixtures';
import { OutsideSensorPropertiesBuilder } from '../../../../functions/alexaSkillFn/builders/OutsideSensorPropertiesBuilder';

describe('OutsideSensorPropertiesBuilder', () => {
    const now = new Date();

    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(global, 'Date').mockImplementation(() => now);
    });
    afterAll(() => jest.restoreAllMocks());

    it('builds systemStatusProperties', () => {
        const systemStatus = systemStatusModel.build();

        // @ts-ignore
        expect(new OutsideSensorPropertiesBuilder().build(systemStatus)).toEqual([
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

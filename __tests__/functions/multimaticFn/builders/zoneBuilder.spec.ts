import * as faker from 'faker';
import { ZoneModel } from 'models';
import { ZoneBuilder } from '../../../../functions/multimaticFn/builders/ZoneBuilder';
import { zoneApiResponse } from '../../../__helpers/apiResponses/zone.apiResponse';

describe('ZoneBuilder', () => {
    describe('#build', () => {
        it('requires a serialNumber and a zoneApiResponse', () => {
            const facilityId = faker.random.uuid();
            const zone: ZoneModel = ZoneBuilder.build(facilityId, zoneApiResponse);

            expect(zone).toEqual({
                id: zoneApiResponse._id,
                facilityId: facilityId,
                enabled: zoneApiResponse.configuration.enabled,
                name: zoneApiResponse.configuration.name.trim().toLowerCase(),
                mode: zoneApiResponse.heating.configuration.mode,
                insideTemperature: zoneApiResponse.configuration.inside_temperature,
                temperatureSetpoint: zoneApiResponse.heating.configuration.setpoint_temperature,
            })
        });
    });
});

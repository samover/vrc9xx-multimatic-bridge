import { SystemModel, SystemOverrideEnum, SystemStatusModel } from 'models';
import { SystemBuilder } from '../../../../functions/multimaticFn/builders/SystemBuilder';
import { ZoneBuilder } from '../../../../functions/multimaticFn/builders/ZoneBuilder';
import { facilityApiResponse } from '../../../__helpers/apiResponses/facility.apiResponse';
import { systemApiResponse } from '../../../__helpers/apiResponses/system.apiReponse';
import { systemQuickmodeApiResponse } from '../../../__helpers/apiResponses/systemQuickmode.apiResponse';

describe('SystemBuilder', () => {
    describe('#buildSystem', () => {
        it('builds a system out of systemApiResponse, facilityApiResponse, apiZones en rooms', () => {
            ZoneBuilder.build = jest.fn().mockReturnValue('zone1');
            // @ts-ignore
            const system: SystemModel = SystemBuilder.buildSystem(systemApiResponse, facilityApiResponse, ['apiZone'], ['room1']);

            expect(ZoneBuilder.build).toHaveBeenCalledWith(facilityApiResponse.serialNumber, 'apiZone');
            expect(system).toEqual({
                id: facilityApiResponse.serialNumber,
                name: facilityApiResponse.name,
                manufacturer: 'Vaillant',
                controller: 'multiMATIC VRC700',
                datetime: systemApiResponse.status.datetime,
                ecoMode: systemApiResponse.configuration.eco_mode,
                holidayMode: {
                    active: systemApiResponse.configuration.holidaymode.active,
                    end: systemApiResponse.configuration.holidaymode.end_date,
                    start: systemApiResponse.configuration.holidaymode.start_date,
                    temperatureSetpoint: systemApiResponse.configuration.holidaymode.temperature_setpoint,
                },
                outsideTemperature: systemApiResponse.status.outside_temperature,
                systemOverride: SystemOverrideEnum.None,
                rooms: ['room1'],
                zones: ['zone1'],
                dhw: []
            });

        });
    });
    describe('#buildSystemStatus', () => {
        it('builds a systemStatus out of systemApiResponse, facilityApiResponse, apiZones en rooms', () => {
            const systemStatus: SystemStatusModel = SystemBuilder.buildSystemStatus(systemApiResponse, facilityApiResponse.serialNumber, systemQuickmodeApiResponse);

            expect(systemStatus).toEqual({
                id: facilityApiResponse.serialNumber,
                datetime: systemApiResponse.status.datetime,
                ecoMode: systemApiResponse.configuration.eco_mode,
                holidayMode: {
                    active: systemApiResponse.configuration.holidaymode.active,
                    end: systemApiResponse.configuration.holidaymode.end_date,
                    start: systemApiResponse.configuration.holidaymode.start_date,
                    temperatureSetpoint: systemApiResponse.configuration.holidaymode.temperature_setpoint,
                },
                outsideTemperature: systemApiResponse.status.outside_temperature,
                systemOverride: systemQuickmodeApiResponse.quickmode,
            });
        });
    });
});

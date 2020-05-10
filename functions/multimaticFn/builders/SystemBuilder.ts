import { RoomModel, SystemModel, SystemOverrideEnum } from 'models';
import { FacilityApiModel, ZoneApiModel, SystemApiModel, SystemQuickModeApiModel } from 'vaillant-api';
import { ZoneBuilder } from './ZoneBuilder';

export class SystemBuilder {
    private static buildHolidayMode(systemDetails: SystemApiModel) {
        return {
            active: systemDetails.configuration.holidaymode.active,
            end: systemDetails.configuration.holidaymode.end_date,
            start: systemDetails.configuration.holidaymode.start_date,
            temperatureSetpoint: systemDetails.configuration.holidaymode.temperature_setpoint,
        };
    }

    static buildSystem(
        systemDetails: SystemApiModel, facility: FacilityApiModel, zones: ZoneApiModel[], rooms: RoomModel[],
    ): SystemModel {
        return {
            id: facility.serialNumber,
            name: facility.name,
            manufacturer: 'Vaillant',
            controller: 'multiMATIC VRC700',
            datetime: systemDetails.status.datetime,
            ecoMode: systemDetails.configuration.eco_mode,
            holidayMode: this.buildHolidayMode(systemDetails),
            outsideTemperature: systemDetails.status.outside_temperature,
            systemOverride: SystemOverrideEnum.None,
            rooms,
            zones: zones.map((z) => ZoneBuilder.build(facility.serialNumber, z)),
            dhw: [],
        };
    }

    static buildSystemStatus(
        systemDetails: SystemApiModel, facilityId: string, systemQuickmode: SystemQuickModeApiModel,
    ) {
        return {
            id: facilityId,
            datetime: systemDetails.status.datetime,
            ecoMode: systemDetails.configuration.eco_mode,
            holidayMode: this.buildHolidayMode(systemDetails),
            outsideTemperature: systemDetails.status.outside_temperature,
            systemOverride: systemQuickmode.quickmode as unknown as SystemOverrideEnum,
        };
    }
}

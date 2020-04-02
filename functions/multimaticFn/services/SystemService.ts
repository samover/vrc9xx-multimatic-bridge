import { LOGGER } from 'logger';
import {
    RoomModel, SystemModel, SystemOverrideEnum, SystemStatusModel,
} from 'models';
import { FacilityApiModel, System } from 'vaillant-api';
import { QuickModeApiEnum } from '../../../modules/vaillant-api/system';
import { ZoneBuilder } from '../builders/ZoneBuilder';
import { RoomService } from './RoomService';

export class SystemService {
    public static async getSystem(sessionId: string, facility: FacilityApiModel): Promise<SystemModel> {
        LOGGER.debug('SystemService.getSystem');
        let rooms: RoomModel[] = [];
        const systemApi = new System(sessionId, facility.serialNumber);
        const systemDetails = await systemApi.getDetails();
        LOGGER.debug(systemDetails, 'SystemDetails');

        const zones = systemDetails.zones.filter((z) => z.currently_controlled_by.name !== 'RBR');
        LOGGER.debug(zones, 'ZONES');
        const systemHasRooms: boolean = systemDetails.zones.some((z) => z.currently_controlled_by.name === 'RBR');
        LOGGER.debug(systemHasRooms, 'systemHasRooms');
        if (systemHasRooms) {
            rooms = await RoomService.getList(sessionId, facility.serialNumber);
        }

        return {
            id: facility.serialNumber,
            name: facility.name,
            manufacturer: 'Vaillant',
            controller: 'multiMATIC VRC700',
            datetime: systemDetails.status.datetime,
            ecoMode: systemDetails.configuration.eco_mode,
            holidayMode: {
                active: systemDetails.configuration.holidaymode.active,
                end: systemDetails.configuration.holidaymode.end_date,
                start: systemDetails.configuration.holidaymode.start_date,
                temperatureSetpoint: systemDetails.configuration.holidaymode.temperature_setpoint,
            },
            outsideTemperature: systemDetails.status.outside_temperature,
            systemOverride: SystemOverrideEnum.None,
            rooms,
            zones: zones.map((z) => ZoneBuilder.build(facility.serialNumber, z)),
            dhw: [],
        };
    }

    public static async getSystemStatus(sessionId: string, facilityId: string): Promise<SystemStatusModel> {
        const systemApi = new System(sessionId, facilityId);
        const systemDetails = await systemApi.getDetails();
        const systemQuickmode = await systemApi.getQuickMode();

        return {
            id: facilityId,
            datetime: systemDetails.status.datetime,
            ecoMode: systemDetails.configuration.eco_mode,
            holidayMode: {
                active: systemDetails.configuration.holidaymode.active,
                end: systemDetails.configuration.holidaymode.end_date,
                start: systemDetails.configuration.holidaymode.start_date,
                temperatureSetpoint: systemDetails.configuration.holidaymode.temperature_setpoint,
            },
            outsideTemperature: systemDetails.status.outside_temperature,
            systemOverride: systemQuickmode.quickmode as unknown as SystemOverrideEnum,
        };
    }
}

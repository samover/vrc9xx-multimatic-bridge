import { RoomModel, SystemModel } from 'models';
import { System } from 'vaillant-api';
import { SystemOverrideEnum } from '../../../modules/models/system.model';
import { FacilityModel } from '../../../modules/vaillant-api/facility';
import { ZoneBuilder } from '../builders/ZoneBuilder';
import { RoomService } from './RoomService';

export class SystemService {
    public static async getSystem(sessionId: string, facility: FacilityModel): Promise<SystemModel> {
        let rooms: RoomModel[] = [];
        const systemApi = new System(sessionId, facility.serialNumber);
        const systemDetails = await systemApi.getDetails();

        const zones = systemDetails.body.zones.filter(z => z.currently_controlled_by.name !== 'RBR');
        const systemHasRooms: boolean = systemDetails.body.zones.some(z => z.currently_controlled_by.name === 'RBR');
        if (systemHasRooms) {
            rooms = await RoomService.getList(sessionId, facility.serialNumber);
        }

        return {
            id: facility.serialNumber,
            name: facility.name,
            manufacturer: 'Vaillant',
            controller: 'multiMATIC VRC700',
            datetime: systemDetails.body.status.datetime,
            ecoMode: systemDetails.body.configuration.eco_mode,
            holidayMode: {
                active: systemDetails.body.configuration.holidaymode.active,
                end: systemDetails.body.configuration.holidaymode.end_date,
                start: systemDetails.body.configuration.holidaymode.start_date,
                temperatureSetpoint: systemDetails.body.configuration.holidaymode.temperature_setpoint,
            },
            outsideTemperature: systemDetails.body.status.outside_temperature,
            systemOverride: SystemOverrideEnum.None,
            rooms,
            zones: zones.map(z => ZoneBuilder.build(facility.serialNumber, z)),
            dhw: [],
        };
    }
}

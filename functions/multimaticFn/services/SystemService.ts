import { RoomModel, SystemModel, SystemStatusModel } from 'models';
import { FacilityApiModel, System, ZoneApiModel, SystemApiModel, SystemQuickModeApiModel } from 'vaillant-api';
import { SystemBuilder } from '../builders/SystemBuilder';
import { RoomService } from './RoomService';

export class SystemService {
    private roomService: RoomService;

    private buildSystem: (
        systemDetails: SystemApiModel, facility: FacilityApiModel, zones: ZoneApiModel[], rooms: RoomModel[],
    ) => SystemModel;

    private buildSystemStatus: (
        systemDetails: SystemApiModel, facilityId: string, systemQuickmode: SystemQuickModeApiModel,
    ) => SystemStatusModel;

    constructor(roomService: RoomService) {
        this.roomService = roomService;
        this.buildSystem = SystemBuilder.buildSystem;
        this.buildSystemStatus = SystemBuilder.buildSystemStatus;
    }

    public async getSystem(sessionId: string, facility: FacilityApiModel): Promise<SystemModel> {
        let rooms: RoomModel[] = [];
        const systemApi = new System(sessionId, facility.serialNumber);
        const systemDetails = await systemApi.getDetails();

        const zones = systemDetails.zones.filter((z) => z.currently_controlled_by.name !== 'RBR');
        const systemHasRooms: boolean = systemDetails.zones.some((z) => z.currently_controlled_by.name === 'RBR');
        if (systemHasRooms) {
            rooms = await this.roomService.getRoomList(sessionId, facility.serialNumber);
        }

        return this.buildSystem(systemDetails, facility, zones, rooms);
    }

    public async getSystemStatus(sessionId: string, facilityId: string): Promise<SystemStatusModel> {
        const systemApi = new System(sessionId, facilityId);
        const systemDetails = await systemApi.getDetails();
        const systemQuickmode = await systemApi.getQuickMode();
        return this.buildSystemStatus(systemDetails, facilityId, systemQuickmode);
    }
}

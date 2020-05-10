import { ZoneModel } from 'models';
import { Zone, ZoneApiModel } from 'vaillant-api';
import { ZoneBuilder } from '../builders/ZoneBuilder';

export class ZoneService {
    private buildZone: (serialNumber: string, zone: ZoneApiModel) => ZoneModel;

    constructor() {
        this.buildZone = ZoneBuilder.build;
    }

    public async getZoneList(sessionId: string, facilityId: string): Promise<ZoneModel[]> {
        const zoneApi = new Zone(sessionId, facilityId);
        const zones = await zoneApi.getList();
        return zones.map((zone) => this.buildZone(facilityId, zone));
    }

    public async getZoneDetails(sessionId: string, facilityId: string, zoneId: string): Promise<ZoneModel> {
        const zoneApi = new Zone(sessionId, facilityId);
        const zone = await zoneApi.getDetails(zoneId);
        return this.buildZone(facilityId, zone);
    }
}

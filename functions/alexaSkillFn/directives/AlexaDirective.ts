import {
    RoomModel, SystemModel, SystemStatusModel, ZoneModel,
} from 'models';
import { RoomPropertiesBuilder } from '../builders/RoomPropertiesBuilder';
import { SystemStatusPropertiesBuilder } from '../builders/SystemStatusPropertiesBuilder';
import { ZonePropertiesBuilder } from '../builders/ZonePropertiesBuilder';
import { REQUESTS, RESPONSES } from '../common/constants/alexaEvent.constants';
import { AlexaEvent, AlexaResponseEvent, ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { Room, System, Zone } from '../multimatic-api';
import { AbstractDirective } from './AbstractDirective';

export class AlexaDirective extends AbstractDirective {
    private roomPropertiesBuilder: RoomPropertiesBuilder;

    private zonePropertiesBuilder: ZonePropertiesBuilder;

    private systemStatusPropertiesBuilder: SystemStatusPropertiesBuilder;

    constructor(event: AlexaEvent) {
        super(event);
        this.roomPropertiesBuilder = new RoomPropertiesBuilder();
        this.zonePropertiesBuilder = new ZonePropertiesBuilder();
        this.systemStatusPropertiesBuilder = new SystemStatusPropertiesBuilder();
    }

    public async handle(): Promise<AlexaResponseEvent> {
        if (this.event.header.name === REQUESTS.ReportState) { return this.handleReportState(); }
        return null; // fixme: return error?
    }

    private async handleReportState(): Promise<AlexaResponseEvent> {
        const [facilityId, type, id] = this.event.endpoint.endpointId.split(':');
        const token = this.event.endpoint.scope.token;

        let properties: ContextProperty[];

        if (type === 'room') properties = await this.getRoomProperties(token, facilityId, id);
        else if (type === 'zone') properties = await this.getZoneProperties(token, facilityId, id);
        else if (type === 'system') properties = await this.getSystemProperties(token, facilityId);
        else properties = null;

        this.addContext({ properties });
        this.updateResponseHeader(RESPONSES.ReportState);
        return this.getResponse();
    }

    private async getRoomProperties(token: string, facilityId: string, roomId: string): Promise<ContextProperty[]> {
        const roomApi = new Room(facilityId, roomId);
        roomApi.addToken(token);

        const room: RoomModel = await roomApi.get();
        return this.roomPropertiesBuilder.build(room);
    }

    private async getZoneProperties(token: string, facilityId: string, zoneId: string): Promise<ContextProperty[]> {
        const zoneApi = new Zone(facilityId, zoneId);
        zoneApi.addToken(token);

        const zone: ZoneModel = await zoneApi.get();
        return this.zonePropertiesBuilder.build(zone);
    }

    private async getSystemProperties(token: string, facilityId: string): Promise<ContextProperty[]> {
        const systemApi = new System(facilityId);
        systemApi.addToken(token);

        const system: SystemStatusModel = await systemApi.get();
        return this.systemStatusPropertiesBuilder.build(system);
    }
}

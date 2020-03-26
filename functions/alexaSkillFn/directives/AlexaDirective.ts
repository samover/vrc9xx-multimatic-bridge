import { RoomModel, SystemModel, SystemStatusModel, ZoneModel } from 'models';
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
        else { return null; } // fixme: return error?
    }

    private async handleReportState() {
        const [facilityId, type, id] = this.event.endpoint.endpointId.split(':');

        if (type === 'room') {
            const roomApi = new Room(facilityId, id);
            roomApi.addToken(this.event.endpoint.scope.token);

            const room: RoomModel = await roomApi.get();
            const roomProperties: ContextProperty[] = this.roomPropertiesBuilder.build(room);

            this.addContext({ properties: roomProperties });
        } else if (type === 'zone') {
            const zoneApi = new Zone(facilityId, id);
            zoneApi.addToken(this.event.endpoint.scope.token);

            const zone: ZoneModel = await zoneApi.get();
            const zoneProperties: ContextProperty[] = this.zonePropertiesBuilder.build(zone);

            this.addContext({ properties: zoneProperties });
        } else if (type === 'system') {
            const systemApi = new System(facilityId);
            systemApi.addToken(this.event.endpoint.scope.token);

            const system: SystemStatusModel = await systemApi.get();
            const systemProperties: ContextProperty[] = this.systemStatusPropertiesBuilder.build(system);
            this.addContext({ properties: systemProperties });
        }

        this.updateResponseHeader(RESPONSES.ReportState);
        return this.getResponse();
    }
}


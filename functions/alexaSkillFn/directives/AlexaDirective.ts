import {AlexaEvent, AlexaResponseEvent, ContextProperty} from '../common/interfaces/alexaEvent.interface';
import {AbstractDirective} from './AbstractDirective';
import {REQUESTS, RESPONSES} from '../common/constants/alexaEvent.constants';
import {Room, Zone} from '../multimatic-api';
import {RoomModel, ZoneModel} from 'models';
import {RoomPropertiesBuilder} from './RoomPropertiesBuilder';

export class AlexaDirective extends AbstractDirective {
    private roomPropertiesBuilder: RoomPropertiesBuilder;

    constructor(event: AlexaEvent) {
        super(event);
        this.roomPropertiesBuilder = new RoomPropertiesBuilder();
    }

    async handle(): Promise<AlexaResponseEvent> {
        if (this.event.header.name === REQUESTS.ReportState) return this.handleReportState();
        else return null; // fixme: return error?
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
            const zoneProperties: ContextProperty[] = this.roomPropertiesBuilder.build(zone);

            this.addContext({ properties: zoneProperties });
        }

        this.updateResponseHeader(RESPONSES.ReportState);
        return this.getResponse();
    }
}


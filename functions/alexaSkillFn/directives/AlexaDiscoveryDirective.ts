import { LOGGER } from 'logger';
import { RoomModel, ZoneModel } from 'models';
import { RoomEndpointsBuilder } from '../builders/RoomEndpointsBuilder';
import { SystemEndpointsBuilder } from '../builders/SystemEndpointsBuilder';
import { ZoneEndpointsBuilder } from '../builders/ZoneEndpointsBuilder';
import { RESPONSES } from '../common/constants/alexaEvent.constants';
import { AlexaResponseEvent } from '../common/interfaces/alexaEvent.interface';
import { Systems } from '../multimatic-api';
import { AbstractDirective } from './AbstractDirective';

export class AlexaDiscoveryDirective extends AbstractDirective {
    public async handle(): Promise<AlexaResponseEvent> {
        this.updateResponseHeader(RESPONSES.Discover);

        // fetch systems
        const systemsApi = new Systems();
        systemsApi.addToken(this.event.payload.scope.token);
        const systems = await systemsApi.get();

        // zones
        const zones: ZoneModel[] = [].concat.apply([], systems.map(s => s.zones));
        const zoneEndpoints = zones.map(ZoneEndpointsBuilder.build);

        // rooms
        const rooms: RoomModel[] = [].concat.apply([], systems.map(s => s.rooms));
        const roomEndpoints = rooms.map(RoomEndpointsBuilder.build);

        // systems
        const systemEndpoints = systems.map(SystemEndpointsBuilder.build);

        LOGGER.debug(roomEndpoints, zoneEndpoints, '*** endpoints');
        await this.addPayload({ endpoints: [...systemEndpoints, ...roomEndpoints, ...zoneEndpoints] });

        return this.getResponse();
    }
}

import { LOGGER } from 'logger';
import { RoomModel, ZoneModel } from 'models';
import { RoomEndpointsBuilder } from '../builders/RoomEndpointsBuilder';
import { SystemEndpointsBuilder } from '../builders/SystemEndpointsBuilder';
import { ZoneEndpointsBuilder } from '../builders/ZoneEndpointsBuilder';
import { RESPONSES } from '../common/constants/alexaEvent.constants';
import { AlexaEvent, AlexaResponseEvent } from '../common/interfaces/alexaEvent.interface';
import { Systems } from '../multimatic-api';
import { AbstractDirective } from './AbstractDirective';

/*
    - all room thermostats
    - outside thermostat sensor
    - main thermostat: resume schedule, turn off/on,
 */
export class AlexaDiscoveryDirective extends AbstractDirective {
    private roomEndpointsBuilder: RoomEndpointsBuilder;

    private zoneEndpointsBuilder: ZoneEndpointsBuilder;

    private systemEndpointsBuilder: SystemEndpointsBuilder;

    constructor(event: AlexaEvent) {
        super(event);
        this.roomEndpointsBuilder = new RoomEndpointsBuilder();
        this.zoneEndpointsBuilder = new ZoneEndpointsBuilder();
        this.systemEndpointsBuilder = new SystemEndpointsBuilder();
    }

    public async handle(): Promise<AlexaResponseEvent> {
        this.updateResponseHeader(RESPONSES.Discover);

        // fetch systems
        const systemsApi = new Systems();
        systemsApi.addToken(this.event.payload.scope.token);
        const systems = await systemsApi.get();

        // eslint-disable-next-line prefer-spread
        const zones: ZoneModel[] = [].concat.apply([], systems.map((s) => s.zones));
        const zoneEndpoints = zones.map((i) => this.zoneEndpointsBuilder.build(i));

        // eslint-disable-next-line prefer-spread
        const rooms: RoomModel[] = [].concat.apply([], systems.map((s) => s.rooms));
        const roomEndpoints = rooms.map((i) => this.roomEndpointsBuilder.build(i));

        // systems
        const systemEndpoints = systems.map((i) => this.systemEndpointsBuilder.build(i));

        LOGGER.debug(roomEndpoints, zoneEndpoints, '*** endpoints');
        await this.addPayload({ endpoints: [...systemEndpoints, ...roomEndpoints, ...zoneEndpoints] });

        return this.getResponse();
    }
}

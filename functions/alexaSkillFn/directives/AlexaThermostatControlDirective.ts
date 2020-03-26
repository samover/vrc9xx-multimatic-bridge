import * as duration from 'duration-fns';
import { LOGGER } from 'logger';
import { RoomModel, ZoneModel } from 'models';
import { RoomPropertiesBuilder } from '../builders/RoomPropertiesBuilder';
import { ZonePropertiesBuilder } from '../builders/ZonePropertiesBuilder';
import { NAMESPACES, REQUESTS, RESPONSES } from '../common/constants/alexaEvent.constants';
import { THERMOSTAT } from '../common/constants/thermostat.constants';
import { AlexaEvent, ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { Room, Zone } from '../multimatic-api';
import { AbstractDirective } from './AbstractDirective';

export class AlexaThermostatControlDirective extends AbstractDirective {
    private roomPropertiesBuilder: RoomPropertiesBuilder;
    private zonePropertiesBuilder: ZonePropertiesBuilder;

    constructor(event: AlexaEvent) {
        super(event);
        this.roomPropertiesBuilder = new RoomPropertiesBuilder();
        this.zonePropertiesBuilder = new ZonePropertiesBuilder();
    }

    public async handle(): Promise<{ event: AlexaEvent }> {
        const [facilityId, type, id] = this.event.endpoint.endpointId.split(':');

        if (type === 'room') {
            const roomApi = new Room(facilityId, id);
            roomApi.addToken(this.event.endpoint.scope.token);

            switch (this.event.header.name) {
                case REQUESTS.SetTargetTemperature:
                    await this.setRoomTargetTemperature(roomApi);
                    break;

                case REQUESTS.AdjustTargetTemperature:
                    await this.adjustRoomTargetTemperature(roomApi);
                    break;

                case REQUESTS.ResumeSchedule:
                    await this.resumeRoomSchedule(roomApi);
                    break;

                default:
                    break;
            }

            const room: RoomModel = await roomApi.get() as RoomModel;
            const roomProperties: ContextProperty[] = this.roomPropertiesBuilder.build(room);

            this.updateResponseHeader(RESPONSES.Response, NAMESPACES.Alexa);
            this.addContext({properties: roomProperties});
            return this.getResponse();
        } else {
            const zoneApi = new Zone(facilityId, id);
            zoneApi.addToken(this.event.endpoint.scope.token);

            switch (this.event.header.name) {
                case REQUESTS.SetTargetTemperature:
                    await this.setZoneTargetTemperature(zoneApi);
                    break;

                case REQUESTS.AdjustTargetTemperature:
                    await this.adjustZoneTargetTemperature(zoneApi);
                    break;

                case REQUESTS.ResumeSchedule:
                    await this.resumeZoneSchedule(zoneApi);
                    break;

                default:
                    break;
            }
            LOGGER.debug('Trying to set temperature of zone');
            const zone: ZoneModel = await zoneApi.get() as ZoneModel;
            const zoneProperties: ContextProperty[] = this.zonePropertiesBuilder.build(zone);

            this.updateResponseHeader(RESPONSES.Response, NAMESPACES.Alexa);
            this.addContext({properties: zoneProperties});
            return this.getResponse();
        }
    }

    private async setZoneTargetTemperature(zoneApi: Zone) {
        const temperature: number = this.event.payload.targetSetpoint && this.event.payload.targetSetpoint.value;
        const durationInMinutes: number = this.event.payload.schedule && this.event.payload.schedule.duration
            ? duration.toMinutes(duration.parse(this.event.payload.schedule.duration))
            : THERMOSTAT.DefaultDurationInMinutes;

        await zoneApi.setTemperature(temperature, durationInMinutes);
    }

    private async setRoomTargetTemperature(roomApi: Room) {
        const temperature: number = this.event.payload.targetSetpoint && this.event.payload.targetSetpoint.value;
        const durationInMinutes: number = this.event.payload.schedule && this.event.payload.schedule.duration
            ? duration.toMinutes(duration.parse(this.event.payload.schedule.duration))
            : THERMOSTAT.DefaultDurationInMinutes;

        await roomApi.setTemperature(temperature, durationInMinutes);
    }

    private async adjustZoneTargetTemperature(zoneApi: Zone) {
        const temperatureDelta: number = this.event.payload.targetSetpointDelta && this.event.payload.targetSetpointDelta.value;
        const zone: ZoneModel = await zoneApi.get();
        await zoneApi.setTemperature(zone.temperatureSetpoint + temperatureDelta, THERMOSTAT.DefaultDurationInMinutes);
    }

    private async adjustRoomTargetTemperature(roomApi: Room) {
        const temperatureDelta: number = this.event.payload.targetSetpointDelta && this.event.payload.targetSetpointDelta.value;
        const room: RoomModel = await roomApi.get();
        await roomApi.setTemperature(room.temperatureSetpoint + temperatureDelta, THERMOSTAT.DefaultDurationInMinutes);
    }

    private async resumeRoomSchedule(roomApi: Room | Zone) {
        await roomApi.resetSchedule();
    }

    private async resumeZoneSchedule(zoneApi: Zone) {
        await zoneApi.resetSchedule();
    }
}


import * as duration from 'duration-fns';
import { RoomModel, ZoneModel } from 'models';
import { RoomPropertiesBuilder } from '../builders/RoomPropertiesBuilder';
import { ZonePropertiesBuilder } from '../builders/ZonePropertiesBuilder';
import { NAMESPACES, REQUESTS, RESPONSES } from '../common/constants/alexaEvent.constants';
import { THERMOSTAT } from '../common/constants/thermostat.constants';
import { AlexaEvent, AlexaResponseEvent, ContextProperty } from '../common/interfaces/alexaEvent.interface';
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

    public async handle(): Promise<AlexaResponseEvent> {
        const [facilityId, type, id] = this.event.endpoint.endpointId.split(':');
        const token = this.event.endpoint.scope.token;
        const eventName = this.event.header.name;

        const properties: ContextProperty[] = type === 'room'
            ? await this.getRoomProperties(token, eventName, facilityId, id)
            : await this.getZoneProperties(token, eventName, facilityId, id);

        this.updateResponseHeader(RESPONSES.Response, NAMESPACES.Alexa);
        this.addContext({ properties });
        return this.getResponse();
    }

    private async getZoneProperties(
        token: string, eventName: string, facilityId: string, zoneId: string,
    ): Promise<ContextProperty[]> {
        const zoneApi = new Zone(facilityId, zoneId);
        zoneApi.addToken(token);

        if (eventName === REQUESTS.SetTargetTemperature) await this.setZoneTargetTemperature(zoneApi);
        if (eventName === REQUESTS.AdjustTargetTemperature) await this.adjustZoneTargetTemperature(zoneApi);
        if (eventName === REQUESTS.ResumeSchedule) await this.resumeZoneSchedule(zoneApi);
        // in case of an unknown event, return the current state of the zone

        const zone: ZoneModel = await zoneApi.get() as ZoneModel;
        return this.zonePropertiesBuilder.build(zone);
    }

    private async getRoomProperties(
        token: string, eventName: string, facilityId: string, roomId: string,
    ): Promise<ContextProperty[]> {
        const roomApi = new Room(facilityId, roomId);
        roomApi.addToken(token);

        if (eventName === REQUESTS.SetTargetTemperature) await this.setRoomTargetTemperature(roomApi);
        if (eventName === REQUESTS.AdjustTargetTemperature) await this.adjustRoomTargetTemperature(roomApi);
        if (eventName === REQUESTS.ResumeSchedule) await this.resumeRoomSchedule(roomApi);
        // in case of an unknown event, return the current state of the room

        const room: RoomModel = await roomApi.get() as RoomModel;
        return this.roomPropertiesBuilder.build(room);
    }

    private async setZoneTargetTemperature(zoneApi: Zone): Promise<void> {
        const temperature: number = this.event.payload.targetSetpoint && this.event.payload.targetSetpoint.value;
        const durationInMinutes: number = this.event.payload.schedule && this.event.payload.schedule.duration
            ? duration.toMinutes(duration.parse(this.event.payload.schedule.duration))
            : THERMOSTAT.DefaultDurationInMinutes;

        await zoneApi.setTemperature(temperature, durationInMinutes);
    }

    private async setRoomTargetTemperature(roomApi: Room): Promise<void> {
        const temperature: number = this.event.payload.targetSetpoint && this.event.payload.targetSetpoint.value;
        const durationInMinutes: number = this.event.payload.schedule && this.event.payload.schedule.duration
            ? duration.toMinutes(duration.parse(this.event.payload.schedule.duration))
            : THERMOSTAT.DefaultDurationInMinutes;

        await roomApi.setTemperature(temperature, durationInMinutes);
    }

    private async adjustZoneTargetTemperature(zoneApi: Zone): Promise<void> {
        const temperatureDelta: number = this.event.payload.targetSetpointDelta
            && this.event.payload.targetSetpointDelta.value;
        const zone: ZoneModel = await zoneApi.get();
        await zoneApi.setTemperature(zone.temperatureSetpoint + temperatureDelta, THERMOSTAT.DefaultDurationInMinutes);
    }

    private async adjustRoomTargetTemperature(roomApi: Room): Promise<void> {
        const temperatureDelta: number = this.event.payload.targetSetpointDelta
            && this.event.payload.targetSetpointDelta.value;
        const room: RoomModel = await roomApi.get();
        await roomApi.setTemperature(room.temperatureSetpoint + temperatureDelta, THERMOSTAT.DefaultDurationInMinutes);
    }

    private async resumeRoomSchedule(roomApi: Room | Zone): Promise<void> {
        await roomApi.resetSchedule();
    }

    private async resumeZoneSchedule(zoneApi: Zone): Promise<void> {
        await zoneApi.resetSchedule();
    }
}

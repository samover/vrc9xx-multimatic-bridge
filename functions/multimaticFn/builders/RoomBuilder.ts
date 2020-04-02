import { RoomModel } from 'models';
import { RoomApiModel } from 'vaillant-api';

export class RoomBuilder {
    public static build(serialNumber: string, room: RoomApiModel): RoomModel {
        return {
            id: room.roomIndex,
            facilityId: serialNumber,
            childLock: room.configuration.childLock,
            currentTemperature: room.configuration.currentTemperature,
            isWindowOpen: room.configuration.isWindowOpen,
            name: room.configuration.name,
            operationMode: room.configuration.operationMode,
            temperatureSetpoint: room.configuration.temperatureSetpoint,
        };
    }
}

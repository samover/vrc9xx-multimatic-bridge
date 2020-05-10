import { RoomModel } from 'models';
import { Room, RoomApiModel } from 'vaillant-api';
import { RoomBuilder } from '../builders/RoomBuilder';

export class RoomService {
    private buildRoom: (serialNumber: string, room: RoomApiModel) => RoomModel;

    constructor() {
        this.buildRoom = RoomBuilder.build;
    }

    public async getRoomList(sessionId: string, facilityId: string): Promise<RoomModel[]> {
        const roomApi = new Room(sessionId, facilityId);
        const rooms = await roomApi.getList();
        return rooms.map((room) => this.buildRoom(facilityId, room));
    }

    public async getRoomDetails(sessionId: string, facilityId: string, roomId: string): Promise<RoomModel> {
        const roomApi = new Room(sessionId, facilityId);
        const room = await roomApi.getDetails(roomId);
        return this.buildRoom(facilityId, room);
    }

    public async setRoomTemperature(
        sessionId: string, facilityId: string, roomId: string, temperature: number, duration: number,
    ): Promise<void> {
        const roomApi = new Room(sessionId, facilityId);
        await roomApi.quickVeto(roomId, temperature, duration);
    }

    public async resetRoomTemperature(sessionId: string, facilityId: string, roomId: string): Promise<void> {
        const roomApi = new Room(sessionId, facilityId);
        await roomApi.deleteQuickVeto(roomId);
    }
}

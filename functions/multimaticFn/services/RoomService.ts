import { RoomModel } from 'models';
import { Room } from 'vaillant-api';
import { RoomBuilder } from '../builders/RoomBuilder';

export class RoomService {
    public static async getList(sessionId: string, serialNumber: string): Promise<RoomModel[]> {
        const roomApi = new Room(sessionId, serialNumber);
        const rooms = await roomApi.getList();
        return rooms.map(room => RoomBuilder.build(serialNumber, room));
    }
}

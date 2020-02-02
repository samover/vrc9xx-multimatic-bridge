import * as duration from 'duration-fns'
import { Authentication, Facility, Room } from "../modules/vaillant-api";

test('Setting room temperature', async () => {
    const input: any = {
        duration: 'PT3H',
        temperature: '22',
        room: 'living room',
    };

    const durationInMinutes = duration.toMinutes(duration.parse(input.duration));

    const authentication =  new Authentication(process.env.USERNAME, process.env.PASSWORD, process.env.SMARTPHONE_ID);
    await authentication.authenticate();
    const facilities = new Facility(authentication.sessionId);
    const facilitiesList = await facilities.getList();

    const serialNumber = facilitiesList[0].serialNumber;
    const room = new Room(authentication.sessionId, serialNumber);

    const rooms = await room.getList();
    const desiredRoom = rooms.find(room => room.configuration.name.toLowerCase() === input.room.toLowerCase());

    const result = await room.quickVeto(desiredRoom.roomIndex, parseInt(input.temperature, 10), durationInMinutes);
});

import * as faker from 'faker';
import { RoomModel } from 'models';
import { RoomBuilder } from '../../../../functions/multimaticFn/builders/RoomBuilder';
import { roomApiResponse } from '../../../__helpers/apiResponses/room.apiResponse';

describe('RoomBuilder', () => {
    describe('#build', () => {
        it('requires a serialNumber and a roomApiResponse', () => {
            const facilityId = faker.random.uuid();
            const room: RoomModel = RoomBuilder.build(facilityId, roomApiResponse);

            expect(room).toEqual({
                id: roomApiResponse.roomIndex,
                facilityId: facilityId,
                childLock: roomApiResponse.configuration.childLock,
                currentTemperature: roomApiResponse.configuration.currentTemperature,
                isWindowOpen: roomApiResponse.configuration.isWindowOpen,
                name: roomApiResponse.configuration.name,
                operationMode: roomApiResponse.configuration.operationMode,
                temperatureSetpoint: roomApiResponse.configuration.temperatureSetpoint,
            })
        });
    });
});

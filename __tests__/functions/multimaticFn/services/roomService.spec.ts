// MOCKS
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';

import { RoomService } from '../../../../functions/multimaticFn/services/RoomService';

describe('RoomService', () => {
    beforeEach(() => {
        this.roomService = new RoomService();
        this.roomService.buildRoom = jest.fn().mockReturnValue('room');
        vaillantApiMock.getRoomsListStub.mockResolvedValue(['apiRoom']);
        vaillantApiMock.getRoomDetailsStub.mockResolvedValue('apiRoom');
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getRoomList', () => {
        it('invokes vaillant.room.getList api', async () => {
            await this.roomService.getRoomList('sessionId', 'facilityId');
            expect(vaillantApiMock.getRoomsListStub).toHaveBeenCalledTimes(1);
        });
        it('builds a room from an apiRoom', async () => {
            await this.roomService.getRoomList('sessionId', 'facilityId');
            expect(this.roomService.buildRoom).toHaveBeenCalledWith('facilityId', 'apiRoom');
        });
        it('returns a list of rooms', async () => {
            await expect(this.roomService.getRoomList('sessionId', 'facilityId')).resolves.toEqual(['room']);
        });
    });
    describe('#getRoomDetails', () => {
        it('invokes vaillant.room.getDetails api', async () => {
            await this.roomService.getRoomDetails('sessionId', 'facilityId');
            expect(vaillantApiMock.getRoomDetailsStub).toHaveBeenCalledTimes(1);
        });
        it('builds a room from an apiRoom', async () => {
            await this.roomService.getRoomDetails('sessionId', 'facilityId');
            expect(this.roomService.buildRoom).toHaveBeenCalledWith('facilityId', 'apiRoom');
        });
        it('returns a list of rooms', async () => {
            await expect(this.roomService.getRoomDetails('sessionId', 'facilityId')).resolves.toEqual('room');
        });
    });
    describe('#setRoomTemperature', () => {
        it('invokes vaillant.room.getDetails api', async () => {
            await this.roomService.setRoomTemperature('sessionId', 'facilityId', 'roomId', 20, 300);
            expect(vaillantApiMock.quickVetoRoomStub).toHaveBeenCalledTimes(1);
            expect(vaillantApiMock.quickVetoRoomStub).toHaveBeenCalledWith('roomId', 20, 300);
        });
        it('resolves when successful', async () => {
            await expect(this.roomService.setRoomTemperature('sessionId', 'facilityId')).resolves.toBeUndefined();
        });
    });
    describe('#ressetRoomTemperature', () => {
        it('invokes vaillant.room.deleteQuickVeto api', async () => {
            await this.roomService.resetRoomTemperature('sessionId', 'facilityId', 'roomId');
            expect(vaillantApiMock.deleteQuickVetoRoomStub).toHaveBeenCalledTimes(1);
            expect(vaillantApiMock.deleteQuickVetoRoomStub).toHaveBeenCalledWith('roomId');
        });
        it('resolves when successful', async () => {
            await expect(this.roomService.resetRoomTemperature('sessionId', 'facilityId')).resolves.toBeUndefined();
        });
    });
});

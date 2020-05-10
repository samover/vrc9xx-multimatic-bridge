import * as faker from 'faker';
import { Authentication, Credentials, Facility, Room } from 'vaillant-api';
import axios from 'axios';
import { ApiPath } from '../../../modules/vaillant-api/ApiPath';
import { errorHandler } from '../../../modules/vaillant-api/errorHandler';

jest.mock('axios');
jest.mock('../../../modules/vaillant-api/errorHandler');

describe('Room', () => {
    const facilitySerialNumber = faker.random.uuid();
    const roomId = faker.random.uuid();
    const jsessionId = faker.random.uuid();

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getList', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body: {
                        rooms: 'rooms',
                    }
                }
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await room.getList();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.rooms(facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns roomsList', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await expect(room.getList()).resolves.toEqual('rooms');
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const room = new Room(jsessionId, facilitySerialNumber);
            await room.getList();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
    describe('#getDetails', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body:  'room',
                },
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await room.getDetails(roomId);

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.room(facilitySerialNumber, roomId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns a room', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await expect(room.getDetails(roomId)).resolves.toEqual('room');
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const room = new Room(jsessionId, facilitySerialNumber);
            await room.getDetails(roomId);

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
    describe('#quickVeto', () => {
        it('invokes vaillant api with sessionId cookie and quickVeto body', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await room.quickVeto(roomId, 20.5, 300);

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.roomQuickVeto(facilitySerialNumber, roomId),
                method: 'PUT',
                data: { temperatureSetpoint: 20.5, duration: 300 },
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const room = new Room(jsessionId, facilitySerialNumber);
            await room.quickVeto(roomId, 20.5, 300);

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
    describe('#deleteQuickVeto', () => {
        it('invokes vaillant api with sessionId cookie', async () => {
            const room = new Room(jsessionId, facilitySerialNumber);
            await room.deleteQuickVeto(roomId);

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.roomQuickVeto(facilitySerialNumber, roomId),
                method: 'DELETE',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const room = new Room(jsessionId, facilitySerialNumber);
            await room.deleteQuickVeto(roomId);

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

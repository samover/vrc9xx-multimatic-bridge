import axios from 'axios';
import * as faker from 'faker';
import { Room } from '../../../../functions/alexaSkillFn/multimatic-api';
import { errorHandler } from '../../../../functions/alexaSkillFn/multimatic-api/errorHandler';

jest.mock('axios');
jest.mock('../../../../functions/alexaSkillFn/multimatic-api/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Room', () => {
    const facilityId = faker.random.uuid();
    const roomId = faker.random.uuid();
    const authToken = faker.internet.password(64);

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#addToken', () => {
        it('has an addToken method', () => {
            const room = new Room(facilityId, roomId);
            expect(room.addToken(authToken)).toBeUndefined();
        });
    });

    describe('#get', () => {
        let room: Room;

        beforeEach(() => {
            room = new Room(facilityId, roomId);
            room.addToken(authToken);
            mockedAxios.request.mockResolvedValue({ data: 'room' });
        });

        it('invokes Multimatic Api', async () => {
            await room.get();

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: room.path,
                method: 'GET',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('returns the room data from the Multimatic Api', async () => {
            await expect(room.get()).resolves.toEqual('room');
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await room.get();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });

    describe('#setTemperature', () => {
        let room: Room;
        let temperature = 20;
        let duration = 3600;

        beforeEach(() => {
            room = new Room(facilityId, roomId);
            room.addToken(authToken);
        });

        it('invokes Multimatic Api', async () => {
            await room.setTemperature(temperature, duration);

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: `${room.path}/temperature`,
                data: { temperature, duration },
                method: 'PUT',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('resolves when succesful', async () => {
            await expect(room.setTemperature(temperature, duration)).resolves.toBeUndefined();
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await room.setTemperature(temperature, duration);

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });

    describe('#resetSchedule', () => {
        let room: Room;
        let temperature = 20;
        let duration = 3600;

        beforeEach(() => {
            room = new Room(facilityId, roomId);
            room.addToken(authToken);
        });

        it('invokes Multimatic Api', async () => {
            await room.resetSchedule();

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: `${room.path}/temperature`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('resolves when succesful', async () => {
            await expect(room.resetSchedule()).resolves.toBeUndefined();
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await room.resetSchedule();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

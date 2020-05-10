import axios from 'axios';
import * as faker from 'faker';
import { Zone } from '../../../../functions/alexaSkillFn/multimatic-api';
import { errorHandler } from '../../../../functions/alexaSkillFn/multimatic-api/errorHandler';

jest.mock('axios');
jest.mock('../../../../functions/alexaSkillFn/multimatic-api/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Zone', () => {
    const facilityId = faker.random.uuid();
    const zoneId = faker.random.uuid();
    const authToken = faker.internet.password(64);

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#addToken', () => {
        it('has an addToken method', () => {
            const zone = new Zone(facilityId, zoneId);
            expect(zone.addToken(authToken)).toBeUndefined();
        });
    });

    describe('#get', () => {
        let zone: Zone;

        beforeEach(() => {
            zone = new Zone(facilityId, zoneId);
            zone.addToken(authToken);
            mockedAxios.request.mockResolvedValue({ data: 'zone' });
        });

        it('invokes Multimatic Api', async () => {
            await zone.get();

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: zone.path,
                method: 'GET',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('returns the zone data from the Multimatic Api', async () => {
            await expect(zone.get()).resolves.toEqual('zone');
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await zone.get();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });

    describe('#setTemperature', () => {
        it('resolves when succesful', async () => {
            const zone = new Zone(facilityId, zoneId);
            await expect(zone.setTemperature(20, 300)).resolves.toBeNull();
        });
    });

    describe('#resetSchedule', () => {
        it('resolves when succesful', async () => {
            const zone = new Zone(facilityId, zoneId);
            await expect(zone.resetSchedule()).resolves.toBeNull();
        });
    });
});

import axios from 'axios';
import * as faker from 'faker';
import { System } from '../../../../functions/alexaSkillFn/multimatic-api';
import { errorHandler } from '../../../../functions/alexaSkillFn/multimatic-api/errorHandler';

jest.mock('axios');
jest.mock('../../../../functions/alexaSkillFn/multimatic-api/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('system', () => {
    const authToken = faker.internet.password(64);
    const facilityId = faker.random.uuid();

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#addToken', () => {
        it('has an addToken method', () => {
            const system = new System(facilityId);
            expect(system.addToken(authToken)).toBeUndefined();
        });
    });

    describe('#get', () => {
        let system: System;

        beforeEach(() => {
            system = new System(facilityId);
            system.addToken(authToken);
            mockedAxios.request.mockResolvedValue({ data: 'system' });
        });

        it('invokes Multimatic Api', async () => {
            await system.get();

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: system.path,
                method: 'GET',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('returns the system data from the Multimatic Api', async () => {
            await expect(system.get()).resolves.toEqual('system');
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await system.get();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

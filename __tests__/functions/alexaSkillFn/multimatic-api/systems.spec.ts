import axios from 'axios';
import * as faker from 'faker';
import { Systems } from '../../../../functions/alexaSkillFn/multimatic-api';
import { errorHandler } from '../../../../functions/alexaSkillFn/multimatic-api/errorHandler';

jest.mock('axios');
jest.mock('../../../../functions/alexaSkillFn/multimatic-api/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('systems', () => {
    const authToken = faker.internet.password(64);

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#addToken', () => {
        it('has an addToken method', () => {
            const systems = new Systems();
            expect(systems.addToken(authToken)).toBeUndefined();
        });
    });

    describe('#get', () => {
        let systems: Systems;

        beforeEach(() => {
            systems = new Systems();
            systems.addToken(authToken);
            mockedAxios.request.mockResolvedValue({ data: 'systems' });
        });

        it('invokes Multimatic Api', async () => {
            await systems.get();

            expect(mockedAxios.request).toHaveBeenCalledWith({
                baseURL: process.env.MULTIMATIC_API_PATH,
                // @ts-ignore
                url: systems.path,
                method: 'GET',
                headers: { Authorization: `Bearer ${authToken}` },
            });
        });
        it('returns the systems data from the Multimatic Api', async () => {
            await expect(systems.get()).resolves.toEqual('systems');
        });
        it('handles error by invoking errorHandler', async () => {
            const error = new Error();
            mockedAxios.request.mockRejectedValue(error);

            await systems.get();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

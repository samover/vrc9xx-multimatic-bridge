import * as faker from 'faker';
import { Authentication, Credentials, Facility } from 'vaillant-api';
import axios from 'axios';
import { ApiPath } from '../../../modules/vaillant-api/ApiPath';
import { errorHandler } from '../../../modules/vaillant-api/errorHandler';

jest.mock('axios');
jest.mock('../../../modules/vaillant-api/errorHandler');

describe('Facility', () => {
    const jsessionId = faker.random.uuid();

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getList', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body: {
                        facilitiesList: 'facilitiesList',
                    }
                }
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const facility = new Facility(jsessionId);
            await facility.getList();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.facilitiesList(),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns facilitesList', async () => {
            const facility = new Facility(jsessionId);
            await expect(facility.getList()).resolves.toEqual('facilitiesList');
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const facility = new Facility(jsessionId);
            await facility.getList();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

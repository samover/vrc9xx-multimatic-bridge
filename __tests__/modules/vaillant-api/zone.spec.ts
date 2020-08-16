import * as faker from 'faker';
import { Authentication, Credentials, Facility, Zone, ZoneApiModel } from 'vaillant-api';
import axios from 'axios';
import { ApiPath } from '../../../modules/vaillant-api/ApiPath';
import { mockSessionId } from '../../../modules/vaillant-api/common/decorators/mock.decorator';
import { errorHandler } from '../../../modules/vaillant-api/errorHandler';
import { mockZoneDetails } from '../../../modules/vaillant-api/mocks/zone.mock';

jest.mock('axios');
jest.mock('../../../modules/vaillant-api/errorHandler');

describe('Zone', () => {
    const facilitySerialNumber = faker.random.uuid();
    const zoneId = faker.random.uuid();
    const jsessionId = faker.random.uuid();

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getList', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body: {
                        zones: 'zones',
                    }
                }
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const zone = new Zone(jsessionId, facilitySerialNumber);
            await zone.getList();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.zones(facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns zonesList', async () => {
            const zone = new Zone(jsessionId, facilitySerialNumber);
            await expect(zone.getList()).resolves.toEqual('zones');
        });
        it('returns mock zonesList', async () => {
            const zone = new Zone(mockSessionId, facilitySerialNumber);
            await expect(zone.getList()).resolves.toEqual(mockZoneDetails);
            expect(axios.request).not.toHaveBeenCalled();
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const zone = new Zone(jsessionId, facilitySerialNumber);
            await zone.getList();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
    describe('#getDetails', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body:  'zone',
                },
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const zone = new Zone(jsessionId, facilitySerialNumber);
            await zone.getDetails(zoneId);

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.zone(facilitySerialNumber, zoneId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns a mock zone', async () => {
            const zone = new Zone(mockSessionId, facilitySerialNumber);
            const id = mockZoneDetails[0]._id;
            await expect(zone.getDetails(id)).resolves.toEqual(mockZoneDetails.find((obj: ZoneApiModel) => obj._id === id));
            expect(axios.request).not.toHaveBeenCalled();
        });
        it('returns a zone', async () => {
            const zone = new Zone(jsessionId, facilitySerialNumber);
            await expect(zone.getDetails(zoneId)).resolves.toEqual('zone');
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const zone = new Zone(jsessionId, facilitySerialNumber);
            await zone.getDetails(zoneId);

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

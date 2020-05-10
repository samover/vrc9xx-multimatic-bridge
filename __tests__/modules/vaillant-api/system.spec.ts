import * as faker from 'faker';
import { Authentication, Credentials, Facility, QuickModeApiEnum, Room, System } from 'vaillant-api';
import axios, { AxiosError } from 'axios';
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

    describe('#getDetails', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body:  'system',
                },
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const system = new System(jsessionId, facilitySerialNumber);
            await system.getDetails();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.system(facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns a system', async () => {
            const system = new System(jsessionId, facilitySerialNumber);
            await expect(system.getDetails()).resolves.toEqual('system');
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const system = new System(jsessionId, facilitySerialNumber);
            await system.getDetails();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
    describe('#getQuickMode', () => {
        beforeEach(() => {
            // @ts-ignore
            axios.request.mockResolvedValue({
                data: {
                    body:  'quickMode',
                },
            });
        });
        it('invokes vaillant api with sessionId cookie', async () => {
            const system = new System(jsessionId, facilitySerialNumber);
            await system.getQuickMode();

            expect(axios.request).toHaveBeenCalledWith({
                url: ApiPath.systemQuickmode(facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${jsessionId}`,
                },
            });
        });
        it('returns a systemQuickMode', async () => {
            const system = new System(jsessionId, facilitySerialNumber);
            await expect(system.getQuickMode()).resolves.toEqual('quickMode');
        });
        it('returns noQuickMode when systemQuickMode is not set', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            error.response = { status: 409 };
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const system = new System(jsessionId, facilitySerialNumber);
            await expect(system.getQuickMode()).resolves.toEqual({ quickmode: QuickModeApiEnum.NO_QUICK_MODE, duration: 0 });
        });
        it('catches the error and passes it to the errorHandler', async () => {
            const error = new Error('BOOM');
            // @ts-ignore
            error.response = { status: 400 };
            // @ts-ignore
            axios.request.mockRejectedValue(error);

            const system = new System(jsessionId, facilitySerialNumber);
            await system.getQuickMode();

            expect(errorHandler).toHaveBeenCalledWith(error);
        });
    });
});

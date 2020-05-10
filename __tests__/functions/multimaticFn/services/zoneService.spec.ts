// MOCKS
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';

import { ZoneService } from '../../../../functions/multimaticFn/services/ZoneService';

describe('ZoneService', () => {
    beforeEach(() => {
        this.zoneService = new ZoneService();
        this.zoneService.buildZone = jest.fn().mockReturnValue('zone');
        vaillantApiMock.getZonesListStub.mockResolvedValue(['apiZone']);
        vaillantApiMock.getZoneDetailsStub.mockResolvedValue('apiZone');
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getZoneList', () => {
        it('invokes vaillant.zone.getList api', async () => {
            await this.zoneService.getZoneList('sessionId', 'facilityId');
            expect(vaillantApiMock.getZonesListStub).toHaveBeenCalledTimes(1);
        });
        it('builds a zone from an apiZone', async () => {
            await this.zoneService.getZoneList('sessionId', 'facilityId');
            expect(this.zoneService.buildZone).toHaveBeenCalledWith('facilityId', 'apiZone');
        });
        it('returns a list of zones', async () => {
            await expect(this.zoneService.getZoneList('sessionId', 'facilityId')).resolves.toEqual(['zone']);
        });
    });
    describe('#getZoneDetails', () => {
        it('invokes vaillant.zone.getDetails api', async () => {
            await this.zoneService.getZoneDetails('sessionId', 'facilityId');
            expect(vaillantApiMock.getZoneDetailsStub).toHaveBeenCalledTimes(1);
        });
        it('builds a zone from an apiZone', async () => {
            await this.zoneService.getZoneDetails('sessionId', 'facilityId');
            expect(this.zoneService.buildZone).toHaveBeenCalledWith('facilityId', 'apiZone');
        });
        it('returns a list of zones', async () => {
            await expect(this.zoneService.getZoneDetails('sessionId', 'facilityId')).resolves.toEqual('zone');
        });
    });
});

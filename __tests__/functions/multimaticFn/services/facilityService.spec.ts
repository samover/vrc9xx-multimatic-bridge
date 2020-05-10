// MOCKS
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';

import { FacilityService } from '../../../../functions/multimaticFn/services/FacilityService';

describe('FacilityService', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getFacilities', () => {
        it('invokes vaillant.getfacilities api', () => {
            vaillantApiMock.getFacilitiesListStub.mockResolvedValue(['facility']);
            expect(new FacilityService().getFacilities('sessionId')).resolves.toEqual(['facility']);
        });
    });
});

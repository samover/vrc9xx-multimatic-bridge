import { Facility, FacilityApiModel } from 'vaillant-api';

export class FacilityService {
    public async getFacilities(sessionId: string): Promise<FacilityApiModel[]> {
        const facilities = new Facility(sessionId);
        return facilities.getList();
    }
}

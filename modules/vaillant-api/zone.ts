import axios, { AxiosRequestConfig } from 'axios';
import { ApiPath } from './ApiPath';
import { mock } from './common/decorators/mock.decorator';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { ZoneApiModel } from './common/interfaces/zoneApiModel.interface';
import { errorHandler } from './errorHandler';
import { mockZoneDetails } from './mocks/zone.mock';

export class Zone {
    private sessionId: string;

    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        this.sessionId = sessionId;
        this.facilitySerialNumber = facilitySerialNumber;
    }

    @mock(mockZoneDetails)
    async getList(): Promise<ZoneApiModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.zones(this.facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body && response.data.body.zones;
        } catch (e) {
            return errorHandler(e);
        }
    }

    @mock(mockZoneDetails)
    public async getDetails(zoneId: string): Promise<ZoneApiModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.zone(this.facilitySerialNumber, zoneId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            return errorHandler(e);
        }
    }
}

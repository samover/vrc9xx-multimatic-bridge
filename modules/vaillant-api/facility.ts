import axios, { AxiosRequestConfig } from 'axios';
import { ApiPath } from './ApiPath';
import { mock } from './common/decorators/mock.decorator';
import { FacilityApiModel } from './common/interfaces/facilityApiModel.interface';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';
import { mockFacilityList } from './mocks/facilityList.mock';
import { VaillantApi } from './vaillantApi';

export class Facility extends VaillantApi {
    @mock(mockFacilityList)
    public async getList(): Promise<FacilityApiModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.facilitiesList(),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body && response.data.body.facilitiesList;
        } catch (e) {
            return errorHandler(e);
        }
    }
}

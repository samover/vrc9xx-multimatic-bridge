import axios, { AxiosRequestConfig } from 'axios';
import { ApiPath } from './ApiPath';
import { mock } from './common/decorators/mock.decorator';
import {
    QuickModeApiEnum,
    SystemApiModel,
    SystemQuickModeApiModel,
} from './common/interfaces/systemApiModel.interface';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';
import { mockQuickMode, mockSystemDetails } from './mocks/system.mock';
import { VaillantApi } from './vaillantApi';

export class System extends VaillantApi {
    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        super(sessionId);
        this.facilitySerialNumber = facilitySerialNumber;
    }

    @mock(mockQuickMode)
    public async getQuickMode(): Promise<SystemQuickModeApiModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: { Cookie: `JSESSIONID=${this.sessionId}` },
                method: 'GET',
                url: ApiPath.systemQuickmode(this.facilitySerialNumber),
            };

            try {
                const response = await axios.request<VaillantApiResponse>(requestConfig);
                return response.data && response.data.body;
            } catch (e) {
                if (e.response.status === 409) return { quickmode: QuickModeApiEnum.NO_QUICK_MODE, duration: 0 };
                throw e;
            }
        } catch (e) {
            return errorHandler(e);
        }
    }

    @mock(mockSystemDetails)
    public async getDetails(): Promise<SystemApiModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
                method: 'GET',
                url: ApiPath.system(this.facilitySerialNumber),
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            return errorHandler(e);
        }
    }
}

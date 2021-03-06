import axios, { AxiosRequestConfig } from 'axios';
import { SystemStatusModel } from 'models';
import { errorHandler } from './errorHandler';

export class System {
    private authToken: string;

    private path: string;

    constructor(facilityId: string) {
        this.path = `facilities/${facilityId}/system`;
    }

    public addToken(authToken: string): void {
        this.authToken = authToken;
    }

    public async get(): Promise<SystemStatusModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: this.path,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            const result = await axios.request<SystemStatusModel>(requestConfig);
            return result.data as SystemStatusModel;
        } catch (e) {
            return errorHandler(e);
        }
    }
}

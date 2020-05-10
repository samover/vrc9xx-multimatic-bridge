import axios, { AxiosRequestConfig } from 'axios';
import { ZoneModel } from 'models';
import { errorHandler } from './errorHandler';

export class Zone {
    private path: string;

    private authToken: string;

    constructor(facilityId: string, zoneId: string) {
        this.path = `facilities/${facilityId}/zones/${zoneId}`;
    }

    public addToken(authToken: string): void {
        this.authToken = authToken;
    }

    public async get(): Promise<ZoneModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: this.path,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            const result = await axios.request<ZoneModel>(requestConfig);
            return result.data as ZoneModel;
        } catch (e) {
            return errorHandler(e);
        }
    }

    public async setTemperature(temperature: number, duration: number): Promise<void> {
        return null;
    }

    public async resetSchedule(): Promise<void> {
        return null;
    }
}

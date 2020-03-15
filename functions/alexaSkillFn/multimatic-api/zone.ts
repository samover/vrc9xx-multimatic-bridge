import {errorHandler} from './errorHandler';
import axios, {AxiosRequestConfig} from 'axios';
import {LOGGER} from 'logger';
import { ZoneModel } from 'models';

export class Zone {
    private path: string;
    private authToken: string;

    constructor(facilityId: string, zoneId: string) {
        this.path = `facilities/${facilityId}/zones/${zoneId}`;
    }

    public addToken(authToken: string) {
        this.authToken = authToken;
    }

    public async get() {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: this.path,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                }
            };

            const result = await axios.request<ZoneModel>(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
            return result.data as ZoneModel;
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN Fetching ZoneProperties');
            console.error(e);
            return errorHandler(e);
        }
    }

    public async setTemperature(): Promise<void> {}

    public async resetSchedule(): Promise<void> {}
}

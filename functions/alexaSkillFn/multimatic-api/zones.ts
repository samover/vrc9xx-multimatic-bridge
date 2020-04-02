import axios, { AxiosRequestConfig } from 'axios';
import { LOGGER } from 'logger';
import { ZoneModel } from 'models';
import { errorHandler } from './errorHandler';

export class Zones {
    private authToken: string;

    public addToken(authToken: string) {
        this.authToken = authToken;
    }

    public async get(): Promise<ZoneModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: '/zones',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            const result = await axios.request<ZoneModel[]>(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
            return result.data as ZoneModel[];
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN fetching zones');
            console.error(e);
            return errorHandler(e);
        }
    }
}

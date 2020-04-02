import axios, { AxiosRequestConfig } from 'axios';
import { LOGGER } from 'logger';
import { SystemModel } from 'models';
import { errorHandler } from './errorHandler';

export class Systems {
    private authToken: string;

    public addToken(authToken: string) {
        this.authToken = authToken;
    }

    public async get(): Promise<SystemModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: '/systems',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            const result = await axios.request<SystemModel[]>(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
            return result.data as SystemModel[];
        } catch (e) {
            return errorHandler(e);
        }
    }
}

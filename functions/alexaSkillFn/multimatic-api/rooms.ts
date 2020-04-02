import axios, { AxiosRequestConfig } from 'axios';
import { LOGGER } from 'logger';
import { RoomModel } from 'models';
import { errorHandler } from './errorHandler';

export class Rooms {
    private authToken: string;

    public addToken(authToken: string) {
        this.authToken = authToken;
    }

    public async get(): Promise<RoomModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: '/rooms',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            const result = await axios.request<RoomModel[]>(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
            return result.data as RoomModel[];
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN SETTING RoomTemperature');
            console.error(e);
            return errorHandler(e);
        }
    }
}

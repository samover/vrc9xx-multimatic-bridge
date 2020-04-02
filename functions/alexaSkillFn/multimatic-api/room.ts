import axios, { AxiosRequestConfig } from 'axios';
import { LOGGER } from 'logger';
import { RoomModel } from 'models';
import { errorHandler } from './errorHandler';

export class Room {
    private path: string;

    private authToken: string;

    constructor(facilityId: string, roomId: string) {
        this.path = `facilities/${facilityId}/rooms/${roomId}`;
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
                },
            };

            const result = await axios.request<RoomModel>(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
            return result.data as RoomModel;
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN SETTING RoomTemperature');
            console.error(e);
            return errorHandler(e);
        }
    }

    public async setTemperature(temperature: number, duration?: number): Promise<void> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: `${this.path}/temperature`,
                method: 'PUT',
                data: { temperature, duration },
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            LOGGER.debug('@@@@@ requestConfig', requestConfig);

            const result = await axios.request(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN SETTING RoomTemperature');
            console.error(e);
            return errorHandler(e);
        }
    }

    public async resetSchedule(): Promise<void> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: `${this.path}/temperature`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            };

            LOGGER.debug('@@@@@ requestConfig', requestConfig);

            const result = await axios.request(requestConfig);
            LOGGER.debug(result.status, '@@@@@ request to multimatic api success');
        } catch (e) {
            console.log('@@@@@@@@@@@ ERROR IN Resetting Room Schedule');
            console.error(e);
            return errorHandler(e);
        }
    }
}

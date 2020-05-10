import axios, { AxiosRequestConfig } from 'axios';
import { RoomModel } from 'models';
import { errorHandler } from './errorHandler';

export class Room {
    private path: string;

    private authToken: string;

    constructor(facilityId: string, roomId: string) {
        this.path = `facilities/${facilityId}/rooms/${roomId}`;
    }

    public addToken(authToken: string): void {
        this.authToken = authToken;
    }

    public async get(): Promise<RoomModel> {
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
            return result.data as RoomModel;
        } catch (e) {
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

            await axios.request(requestConfig);
        } catch (e) {
            errorHandler(e);
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

            await axios.request(requestConfig);
        } catch (e) {
            errorHandler(e);
        }
    }
}

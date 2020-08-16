import axios, { AxiosRequestConfig } from 'axios';
import { ApiPath } from './ApiPath';
import { mock } from './common/decorators/mock.decorator';
import { RoomApiModel } from './common/interfaces/roomApiModel.interface';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';
import { mockRoomDetails } from './mocks/room.mock';
import { VaillantApi } from './vaillantApi';

export class Room extends VaillantApi {
    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        super(sessionId);
        this.facilitySerialNumber = facilitySerialNumber;
    }

    @mock(mockRoomDetails)
    public async getList(): Promise<RoomApiModel[]> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.rooms(this.facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body && response.data.body.rooms;
        } catch (e) {
            return errorHandler(e);
        }
    }

    @mock(mockRoomDetails)
    public async getDetails(roomId: string): Promise<RoomApiModel> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.room(this.facilitySerialNumber, roomId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            return errorHandler(e);
        }
    }

    @mock(null)
    public async quickVeto(roomId: string, temperature: number, duration: number): Promise<void> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.roomQuickVeto(this.facilitySerialNumber, `${roomId}`),
                method: 'PUT',
                data: { temperatureSetpoint: temperature, duration },
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            await axios.request<VaillantApiResponse>(requestConfig);
        } catch (e) {
            errorHandler(e);
        }
    }

    @mock(null)
    public async deleteQuickVeto(roomId: string): Promise<void> {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.roomQuickVeto(this.facilitySerialNumber, `${roomId}`),
                method: 'DELETE',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            await axios.request<VaillantApiResponse>(requestConfig);
        } catch (e) {
            errorHandler(e);
        }
    }
}

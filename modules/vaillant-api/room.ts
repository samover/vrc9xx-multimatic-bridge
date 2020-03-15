import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiPath } from './ApiPath';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';

export interface DeviceModel {
    name: string;
    sgtin: string;
    deviceType: string; // VALVE
    isBatteryLow: boolean;
    isRadioOutOfReach: boolean;

}

export interface RoomConfigurationModel {
    name: string;
    temperatureSetpoint: number;
    operationMode: string; // AUTO
    currentTemperature: number;
    childLock: boolean;
    isWindowOpen: boolean;
    devices: DeviceModel[];
    iconId: string;
}

export interface SetPointModel {
    startTime: string;
    temperatureSetPoint: number;
}

export interface TimeProgramModel {
    monday: SetPointModel[],
    tuesday: SetPointModel[],
    wednesday: SetPointModel[],
    thursday: SetPointModel[],
    friday: SetPointModel[],
    saturday: SetPointModel[],
    sunday: SetPointModel[],
}

export interface RoomApiModel {
    roomIndex: number;
    configuration: RoomConfigurationModel;
    timeprogram: TimeProgramModel;
}

export class Room {
    private sessionId: string;
    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        this.sessionId = sessionId;
        this.facilitySerialNumber = facilitySerialNumber;
    }

    public getList = async (): Promise<RoomApiModel[]> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.rooms(this.facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                }
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body && response.data.body.rooms;
        } catch (e) {
            errorHandler(e);
        }
    };

    public getDetails = async (roomId: string): Promise<RoomApiModel> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.room(this.facilitySerialNumber, roomId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                }
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            errorHandler(e);
        }
    };

    public quickVeto = async(roomId: string, temperature: number, duration: number): Promise<void> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.roomQuickVeto(this.facilitySerialNumber, `${roomId}`),
                method: 'PUT',
                data: { temperatureSetpoint: temperature, duration },
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                }
            };

            await axios.request<VaillantApiResponse>(requestConfig);
        } catch (e) {
            errorHandler(e);
        }
    };

    public deleteQuickVeto = async(roomId: string): Promise<void> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.roomQuickVeto(this.facilitySerialNumber, `${roomId}`),
                method: 'DELETE',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                }
            };

            await axios.request<VaillantApiResponse>(requestConfig);
        } catch (e) {
            errorHandler(e);
        }
    }
}

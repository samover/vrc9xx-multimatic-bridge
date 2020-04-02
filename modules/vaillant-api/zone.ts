import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiPath } from './ApiPath';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';
import { RoomApiModel } from './room';

export interface DeviceModel {
    name: string;
    sgtin: string;
    deviceType: string; // VALVE
    isBatteryLow: boolean;
    isRadioOutOfReach: boolean;

}

export interface QuickVetoModel {
    active: boolean;
    setpoint_temperature: number;
}

export interface ZoneConfigurationModel {
    name: string;
    enabled: boolean;
    active_function: string;
    inside_temperature: number;
    quick_veto: QuickVetoModel;
}

export interface SetPointModel {
    startTime: string;
    setting: string;
}

export interface TimeProgramModel {
    monday: SetPointModel[];
    tuesday: SetPointModel[];
    wednesday: SetPointModel[];
    thursday: SetPointModel[];
    friday: SetPointModel[];
    saturday: SetPointModel[];
    sunday: SetPointModel[];
}

export interface HeatingConfigurationModel {
    mode: string;
    setback_temperature: number;
    setpoint_temperature: number;
}

export interface ZoneApiModel {
    _id: string;
    configuration: ZoneConfigurationModel;
    heating: {
        timeprogram: TimeProgramModel;
        configuration: HeatingConfigurationModel;
    };
    currently_controlled_by: {
        name: string;
    };
}

export class Zone {
    private sessionId: string;

    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        this.sessionId = sessionId;
        this.facilitySerialNumber = facilitySerialNumber;
    }

    public getList = async (): Promise<ZoneApiModel[]> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.zones(this.facilitySerialNumber),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            errorHandler(e);
        }
    };

    public getDetails = async (zoneId: string): Promise<ZoneApiModel> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.zone(this.facilitySerialNumber, zoneId),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
            };

            const response = await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            errorHandler(e);
        }
    };
}

import axios, { AxiosRequestConfig } from 'axios';
import { ApiPath } from './ApiPath';
import { VaillantApiResponse } from './common/interfaces/vaillantApiResponse.interface';
import { errorHandler } from './errorHandler';
import { TimeProgramModel, ZoneApiModel } from './zone';

export interface SystemConfigurationModel {
    eco_mode: boolean;
    holidaymode: {
        active: boolean;
        start_date: string;
        end_date: string;
        temperature_setpoint: number;
    }
}

export interface SystemSetPointModel {
    startTime: string;
    mode: 'ON' | 'OFF';
}

export interface SystemTimeProgramModel {
    monday: SystemSetPointModel[],
    tuesday: SystemSetPointModel[],
    wednesday: SystemSetPointModel[],
    thursday: SystemSetPointModel[],
    friday: SystemSetPointModel[],
    saturday: SystemSetPointModel[],
    sunday: SystemSetPointModel[],
}

export interface SystemStatusModel {
    datetime: Date;
    outside_temperature: number;
}

export interface DomesticHotWaterModel {
    _id: string;
    hotwater: {
        configuration: {
            operation_mode: 'ON' | 'OFF' | 'AUTO';
            temperature_setpoint: number;
        },
        timeprogram: SystemTimeProgramModel
    }
}

export interface SystemModel {
    body: {
        configuration: SystemConfigurationModel;
        status: SystemStatusModel;
        zones: ZoneApiModel[];
        dhw: DomesticHotWaterModel[];
    }
}

export class System {
    private sessionId: string;
    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        this.sessionId = sessionId;
        this.facilitySerialNumber = facilitySerialNumber;
    }

    public getDetails = async (): Promise<SystemModel> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
                method: 'GET',
                url: ApiPath.system(this.facilitySerialNumber),
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body;
        } catch (e) {
            errorHandler(e);
        }
    };
}

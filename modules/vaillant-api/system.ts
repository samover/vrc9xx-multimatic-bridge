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

export interface SystemStatusApiModel {
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

export interface SystemApiModel {
    configuration: SystemConfigurationModel;
    status: SystemStatusApiModel;
    zones: ZoneApiModel[];
    dhw: DomesticHotWaterModel[];
}

export enum QuickModeApiEnum { NO_QUICK_MODE, QM_PARTY, QM_VENTILATION_BOOST, QM_ONE_DAY_AT_HOME, QM_ONE_DAY_AWAY, }

export interface SystemQuickModeApiModel {
    quickmode: QuickModeApiEnum;
    duration: number;
}

export class System {
    private sessionId: string;
    private facilitySerialNumber: string;

    constructor(sessionId: string, facilitySerialNumber: string) {
        this.sessionId = sessionId;
        this.facilitySerialNumber = facilitySerialNumber;
    }

    public getQuickMode = async (): Promise<SystemQuickModeApiModel> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                },
                method: 'GET',
                url: ApiPath.systemQuickmode(this.facilitySerialNumber),
            };

            try {
                const response =  await axios.request<VaillantApiResponse>(requestConfig);
                return response.data && response.data.body;
            } catch (e) {
                if (e.response.status === 409) {
                    return { quickmode: QuickModeApiEnum.NO_QUICK_MODE, duration: 0 };
                }
                throw e;
            }
        } catch (e) {
            errorHandler(e);
        }
    };

    public getDetails = async (): Promise<SystemApiModel> => {
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

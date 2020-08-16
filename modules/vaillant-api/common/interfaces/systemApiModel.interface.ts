import { ZoneApiModel } from './zoneApiModel.interface';

export interface SystemConfigurationModel {
    eco_mode: boolean;
    holidaymode: {
        active: boolean;
        start_date: string;
        end_date: string;
        temperature_setpoint: number;
    };
}

export interface SystemSetPointModel {
    startTime: string;
    mode: 'ON' | 'OFF';
}

export interface SystemSetPointModel2 {
    startTime: string;
    setting: 'ON' | 'OFF';
}

export interface SystemTimeProgramModel<T> {
    monday: T[];
    tuesday: T[];
    wednesday: T[];
    thursday: T[];
    friday: T[];
    saturday: T[];
    sunday: T[];
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
        };
        timeprogram: SystemTimeProgramModel<SystemSetPointModel>;
    };
    circulation: {
        configuration: {
            operationMode: 'ON' | 'OFF' | 'AUTO';
        };
        timeprogram: SystemTimeProgramModel<SystemSetPointModel2>;
    };
}

export interface SystemApiModel {
    configuration: SystemConfigurationModel;
    status: SystemStatusApiModel;
    zones: ZoneApiModel[];
    dhw: DomesticHotWaterModel[];
}

export enum QuickModeApiEnum {
    NO_QUICK_MODE = 'NO_QUICK_MODE',
    QM_PARTY = 'QM_PARTY',
    QM_VENTILATION_BOOST = 'QM_VENTILATION_BOOST',
    QM_ONE_DAY_AT_HOME = 'QM_ONE_DAY_AT_HOME',
    QM_ONE_DAY_AWAY = 'QM_ONE_DAY_AWAY',
}

export interface SystemQuickModeApiModel {
    quickmode: QuickModeApiEnum;
    duration: number;
}
import { RoomModel } from './room.model';
import { ZoneModel } from './zone.model';

export interface HolidayModeModel {
    active: boolean;
    start: string;
    end: string;
    temperatureSetpoint: number;
}

export enum SystemOverrideEnum {
    Party = 'QM_PARTY',
    None = 'NO_QUICK_MODE',
    VentilationBoost = 'QM_VENTILATION_BOOST',
    DayAtHome = 'QM_ONE_DAY_AT_HOME',
    DayAwayFromHome = 'QM_ONE_DAY_AWAY',
}

export enum OperationModeModel {
    On = 'ON',
    Off = 'OFF',
    Auto = 'AUTO'
}

export interface DomesticHotWaterModel {
    id: string;
    temperatureSetpoint: number;
    operationMode: OperationModeModel,
}

export interface SystemModel {
    id: string;
    name: string;
    manufacturer: string;
    controller: string;
    outsideTemperature: number;
    datetime: Date;
    systemOverride: SystemOverrideEnum,
    ecoMode: boolean;
    holidayMode: HolidayModeModel;
    rooms: RoomModel[];
    zones: ZoneModel[];
    dhw: [];
}


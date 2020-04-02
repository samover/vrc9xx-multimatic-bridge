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

/*
 VAILLANT: QM_ONE_DAY_AT_HOME

 STATUS: 'QuickMode.DayAtHome'
 */
export enum OperationModeModel {
    On = 'ON',
    Off = 'OFF',
    Auto = 'AUTO'
}

export interface DomesticHotWaterModel {
    id: string;
    temperatureSetpoint: number;
    operationMode: OperationModeModel;
}

export interface SystemStatusModel {
    id: string;
    outsideTemperature: number;
    datetime: Date;
    systemOverride: SystemOverrideEnum;
    ecoMode: boolean;
    holidayMode: HolidayModeModel;
}

export interface SystemModel extends SystemStatusModel {
    name: string;
    manufacturer: string;
    controller: string;
    rooms: RoomModel[];
    zones: ZoneModel[];
    dhw: [];
}

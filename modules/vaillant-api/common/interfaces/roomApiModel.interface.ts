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

export interface TimeProgramModel {
    monday: SetPointModel[];
    tuesday: SetPointModel[];
    wednesday: SetPointModel[];
    thursday: SetPointModel[];
    friday: SetPointModel[];
    saturday: SetPointModel[];
    sunday: SetPointModel[];
}

export interface RoomApiModel {
    roomIndex: number;
    configuration: RoomConfigurationModel;
    timeprogram: TimeProgramModel;
}

export interface DeviceModel {
    name: string;
    sgtin: string;
    deviceType: string; // VALVE
    isBatteryLow: boolean;
    isRadioOutOfReach: boolean;
}

export interface SetPointModel {
    startTime: string;
    temperatureSetpoint: number;
}
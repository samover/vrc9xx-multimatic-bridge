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
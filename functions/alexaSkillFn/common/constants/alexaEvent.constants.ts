export const NAMESPACES = {
    Alexa: 'Alexa',
    AlexaControl: 'Alexa.Control',
    AlexaDiscovery: 'Alexa.Discovery',
    AlexaThermostatController: 'Alexa.ThermostatController',
    AlexaEndpointHealth: 'Alexa.EndpointHealth',
    AlexaTemperatureSensor: 'Alexa.TemperatureSensor',
    AlexaModeController: 'Alexa.ModeController',
    ThermostatEcoMode: 'Thermostat.EcoMode',
    ThermostatQuickMode: 'Thermostat.QuickMode',
};

export const REQUESTS = {
    Discover: 'Discover.Request',
    TurnOn: 'TurnOnRequest',
    TurnOff: 'TurnOffRequest',
    ReportState: 'ReportState',
    SetTargetTemperature: 'SetTargetTemperature',
    AdjustTargetTemperature: 'AdjustTargetTemperature',
    ResumeSchedule: 'ResumeSchedule',
};

export const RESPONSES = {
    Discover: 'Discover.Response',
    TurnOn: 'TurnOnConfirmation',
    TurnOff: 'TurnOffConfirmation',
    ReportState: 'StateReport',
    Response: 'Response',
};

export const ERRORS = {
    UnsupportOperation: 'UnsupportedOperationError',
    UnexpecedInfo: 'UnexpectedInformationReceivedError',
};

export const INTERFACE_PROPERTIES = {
    ThermostatController: {
        TargetSetpoint: 'targetSetpoint',
        LowerSetpoint: 'lowerSetpoint',
        UpperSetpoint: 'upperSetpoint',
        ThermostatMode: 'thermostatMode'
    },
    TemperatureSensor: {
        Temperature: 'temperature',
    },
    EndpointHealth: {
        Connectivity: 'connectivity',
    },
};

export const MODE_CONTROLLER_VALUES = {
    QuickModeNormal: 'QuickMode.Normal',
    QuickModeParty: 'QuickMode.Party',
    QuickModeVentilationBoost: 'QuickMode.VentilationBoost',
    QuickModeDayAtHome: 'QuickMode.DayAtHome',
    QuickModeAwayFromHome: 'QuickMode.AwayFromHome',
    EcoModeOn: 'EcoMode.On',
    EcoModeOff: 'EcoMode.Off',
};

export const SCALES = {
    Celsius: 'CELSIUS',
};

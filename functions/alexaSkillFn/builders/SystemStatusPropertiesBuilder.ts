import { SystemOverrideEnum, SystemStatusModel } from 'models';
import {
    INTERFACE_PROPERTIES,
    MODE_CONTROLLER_VALUES,
    NAMESPACES,
    SCALES
} from '../common/constants/alexaEvent.constants';
import { ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { PropertiesBuilder } from '../common/interfaces/builder';

export class SystemStatusPropertiesBuilder implements PropertiesBuilder {

    public build(system: SystemStatusModel): ContextProperty[] {
        const timestamp = (new Date()).toISOString();

        return [
            {
                namespace: NAMESPACES.AlexaModeController,
                instance: NAMESPACES.ThermostatQuickMode,
                name: 'Thermostat Override',
                value: this.parseQuickmodeValue(system.systemOverride),
                timeOfSample: timestamp,
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: NAMESPACES.AlexaModeController,
                instance: NAMESPACES.ThermostatEcoMode,
                name: 'Eco Mode',
                value: system.ecoMode ? MODE_CONTROLLER_VALUES.EcoModeOn : MODE_CONTROLLER_VALUES.EcoModeOff,
                timeOfSample: timestamp,
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: NAMESPACES.AlexaTemperatureSensor,
                // name: INTERFACE_PROPERTIES.TemperatureSensor.Temperature,
                name: 'Outside Temperature',
                value: {
                    value: system.outsideTemperature,
                    scale: SCALES.Celsius,
                },
                timeOfSample: timestamp,
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: NAMESPACES.AlexaEndpointHealth,
                name: INTERFACE_PROPERTIES.EndpointHealth.Connectivity,
                value: {
                    value: 'OK'
                },
                timeOfSample: timestamp,
                uncertaintyInMilliseconds: 6000
            }
        ];
    }
    private parseQuickmodeValue(systemOverride: SystemOverrideEnum): string {
        let quickmodeValue: string;

        switch (systemOverride) {
            case SystemOverrideEnum.DayAtHome:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeDayAtHome;
                break;
            case SystemOverrideEnum.DayAwayFromHome:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeAwayFromHome;
                break;
            case SystemOverrideEnum.None:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeNormal;
                break;
            case SystemOverrideEnum.Party:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeParty;
                break;
            case SystemOverrideEnum.VentilationBoost:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeVentilationBoost;
                break;
            default:
                quickmodeValue = MODE_CONTROLLER_VALUES.QuickModeNormal;
                break;
        }

        return quickmodeValue;
    }
    private parseThermostatMode(operationMode: string) {
        if (operationMode === 'AUTO') { return 'AUTO'; }
        if (operationMode === 'OFF') { return 'OFF'; }
        return 'HEAT';
    }
}

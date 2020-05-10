import { SystemStatusModel } from 'models';
import {
    INTERFACE_PROPERTIES,
    MODE_CONTROLLER_VALUES,
    NAMESPACES,
    SCALES,
} from '../common/constants/alexaEvent.constants';
import { ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { PropertiesBuilder } from '../common/interfaces/builder';
import { PropertiesBlock } from '../common/interfaces/propertiesBlock.interface';
import { parseQuickmodeValue } from './builderHelpers';

export class SystemStatusPropertiesBuilder implements PropertiesBuilder {
    public build(system: SystemStatusModel): ContextProperty[] {
        const timestamp = (new Date()).toISOString();

        return [
            SystemStatusPropertiesBuilder.buildThermostatQuickModeBlock(system, timestamp),
            SystemStatusPropertiesBuilder.buildThermostatEcoModeBlock(system, timestamp),
            SystemStatusPropertiesBuilder.buildTemperatureSensorBlock(system, timestamp),
            SystemStatusPropertiesBuilder.buildConnectivityBlock(timestamp),
        ];
    }

    private static buildThermostatQuickModeBlock(system: SystemStatusModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaModeController,
            instance: NAMESPACES.ThermostatQuickMode,
            name: 'Thermostat Override',
            value: parseQuickmodeValue(system.systemOverride),
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildThermostatEcoModeBlock(system: SystemStatusModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaModeController,
            instance: NAMESPACES.ThermostatEcoMode,
            name: 'Eco Mode',
            value: system.ecoMode ? MODE_CONTROLLER_VALUES.EcoModeOn : MODE_CONTROLLER_VALUES.EcoModeOff,
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildTemperatureSensorBlock(system: SystemStatusModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaTemperatureSensor,
            // name: INTERFACE_PROPERTIES.TemperatureSensor.Temperature,
            name: 'Outside Temperature',
            value: {
                value: system.outsideTemperature,
                scale: SCALES.Celsius,
            },
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildConnectivityBlock(timestamp: string): PropertiesBlock{
        return {
            namespace: NAMESPACES.AlexaEndpointHealth,
            name: INTERFACE_PROPERTIES.EndpointHealth.Connectivity,
            value: {
                value: 'OK',
            },
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

}

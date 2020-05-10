import { ZoneModel } from 'models';
import { INTERFACE_PROPERTIES, NAMESPACES, SCALES } from '../common/constants/alexaEvent.constants';
import { ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { PropertiesBuilder } from '../common/interfaces/builder';
import { PropertiesBlock } from '../common/interfaces/propertiesBlock.interface';
import { parseThermostatMode } from './builderHelpers';

export class ZonePropertiesBuilder implements PropertiesBuilder {
    public build(zone: ZoneModel): ContextProperty[] {
        const timestamp = (new Date()).toISOString();

        return [
            ZonePropertiesBuilder.buildThermostatModeBlock(zone, timestamp),
            ZonePropertiesBuilder.buildTemperatureBlock(zone, timestamp),
            ZonePropertiesBuilder.buildConnectivityBlock(timestamp),
        ];
    }

    private static buildThermostatModeBlock(zone: ZoneModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaThermostatController,
            name: INTERFACE_PROPERTIES.ThermostatController.ThermostatMode,
            value: parseThermostatMode(zone.mode),
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildTemperatureBlock(zone: ZoneModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaTemperatureSensor,
            name: INTERFACE_PROPERTIES.TemperatureSensor.Temperature,
            value: {
                value: zone.insideTemperature,
                scale: SCALES.Celsius,
            },
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildConnectivityBlock(timestamp: string): PropertiesBlock {
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

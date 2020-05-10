import { RoomModel } from 'models';
import { INTERFACE_PROPERTIES, NAMESPACES, SCALES } from '../common/constants/alexaEvent.constants';
import { ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { PropertiesBuilder } from '../common/interfaces/builder';
import { PropertiesBlock } from '../common/interfaces/propertiesBlock.interface';
import { parseThermostatMode } from './builderHelpers';

export class RoomPropertiesBuilder implements PropertiesBuilder {
    public build(room: RoomModel): ContextProperty[] {
        const timestamp = (new Date()).toISOString();

        return [
            RoomPropertiesBuilder.buildTargetSetpointBlock(room, timestamp),
            RoomPropertiesBuilder.buildThermostatModeBlock(room, timestamp),
            RoomPropertiesBuilder.buildTemperatureBlock(room, timestamp),
            RoomPropertiesBuilder.buildConnectivityBlock(room, timestamp),
        ];
    }

    private static buildTargetSetpointBlock(room: RoomModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaThermostatController,
            name: INTERFACE_PROPERTIES.ThermostatController.TargetSetpoint,
            value: {
                value: room.temperatureSetpoint,
                scale: SCALES.Celsius,
            },
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildThermostatModeBlock(room: RoomModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaThermostatController,
            name: INTERFACE_PROPERTIES.ThermostatController.ThermostatMode,
            value: parseThermostatMode(room.operationMode),
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildTemperatureBlock(room: RoomModel, timestamp: string): PropertiesBlock {
        return {
            namespace: NAMESPACES.AlexaTemperatureSensor,
            name: INTERFACE_PROPERTIES.TemperatureSensor.Temperature,
            value: {
                value: room.currentTemperature,
                scale: SCALES.Celsius,
            },
            timeOfSample: timestamp,
            uncertaintyInMilliseconds: 6000,
        };
    }

    private static buildConnectivityBlock(room: RoomModel, timestamp: string): PropertiesBlock {
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

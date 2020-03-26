import { ZoneModel } from 'models';
import { INTERFACE_PROPERTIES, NAMESPACES, SCALES } from '../common/constants/alexaEvent.constants';
import { ContextProperty } from '../common/interfaces/alexaEvent.interface';
import { PropertiesBuilder } from '../common/interfaces/builder';

export class ZonePropertiesBuilder implements PropertiesBuilder {

    public build(zone: ZoneModel): ContextProperty[] {
        const timestamp = (new Date()).toISOString();

        return [
            {
                namespace: NAMESPACES.AlexaThermostatController,
                name: INTERFACE_PROPERTIES.ThermostatController.ThermostatMode,
                value: this.parseThermostatMode(zone.mode),
                timeOfSample: timestamp,
                uncertaintyInMilliseconds: 6000
            },
            {
                namespace: NAMESPACES.AlexaTemperatureSensor,
                name: INTERFACE_PROPERTIES.TemperatureSensor.Temperature,
                value: {
                    value: zone.insideTemperature,
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
    private parseThermostatMode(operationMode: string) {
        if (operationMode === 'AUTO') { return 'AUTO'; }
        if (operationMode === 'OFF') { return 'OFF'; }
        return 'HEAT';
    }
}

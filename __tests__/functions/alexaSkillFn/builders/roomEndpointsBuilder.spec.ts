import { roomModel } from '../../../__helpers/fixtures';
import { RoomEndpointsBuilder } from '../../../../functions/alexaSkillFn/builders/RoomEndpointsBuilder';

describe('RoomeEndpointsBuilder', () => {
    const room = roomModel.build();

    it('builds roomEndpoint', () => {
        expect(new RoomEndpointsBuilder().build(room)).toEqual({
            endpointId: `${room.facilityId}:room:${room.id}`,
            manufacturerName: 'Vaillant',
            description: 'Ambisense Thermostatic Valve',
            friendlyName: `${room.name} thermostat`,
            displayCategories: [
                'THERMOSTAT',
                'TEMPERATURE_SENSOR'
            ],
            cookie: {},
            capabilities: [
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.ThermostatController',
                    version: '3',
                    properties: {
                        supported: [
                            {
                                name: 'targetSetpoint'
                            },
                            {
                                name: 'thermostatMode'
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    },
                    configuration: {
                        supportedModes: [
                            'HEAT',
                            'ECO',
                            'AUTO',
                            'OFF'
                        ],
                        supportsScheduling: true
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.TemperatureSensor',
                    version: '3',
                    properties: {
                        supported: [
                            {
                                name: 'temperature'
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.EndpointHealth',
                    version: '3',
                    properties: {
                        supported: [
                            {
                                name: 'connectivity'
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa',
                    version: '3'
                }
            ]
        });
    });
});

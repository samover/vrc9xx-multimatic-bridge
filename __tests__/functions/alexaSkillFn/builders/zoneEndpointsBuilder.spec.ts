import { zoneModel } from '../../../__helpers/fixtures';
import { ZoneEndpointsBuilder } from '../../../../functions/alexaSkillFn/builders/ZoneEndpointsBuilder';

describe('ZoneEndpointsBuilder', () => {
    const zone = zoneModel.build();

    it('builds zoneEndpoint', () => {
        expect(new ZoneEndpointsBuilder().build(zone)).toEqual(  {
            endpointId: `${zone.facilityId}:zone:${zone.id}`,
            manufacturerName: "Vaillant",
            description: "Multimatic Thermostat",
            friendlyName: `${zone.name} thermostat`,
            displayCategories: [
                "THERMOSTAT",
                "TEMPERATURE_SENSOR"
            ],
            cookie: {},
            capabilities: [
                {
                    type: "AlexaInterface",
                    interface: "Alexa.ThermostatController",
                    version: "3",
                    properties: {
                        supported: [
                            {
                                name: "targetSetpoint"
                            },
                            {
                                name: "thermostatMode"
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    },
                    configuration: {
                        supportedModes: [
                            "HEAT",
                            "ECO",
                            "AUTO",
                            "OFF"
                        ],
                        supportsScheduling: true
                    }
                },
                {
                    type: "AlexaInterface",
                    interface: "Alexa.TemperatureSensor",
                    version: "3",
                    properties: {
                        supported: [
                            {
                                name: "temperature"
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    }
                },
                {
                    type: "AlexaInterface",
                    interface: "Alexa.EndpointHealth",
                    version: "3",
                    properties: {
                        supported: [
                            {
                                name: "connectivity"
                            }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    }
                },
                {
                    type: "AlexaInterface",
                    interface: "Alexa.ModeController",
                    instance: "RoomThermostat.Mode",
                    version: "3",
                    properties: {
                        supported: [
                            {
                                name: "mode"
                            }
                        ],
                        retrievable: true,
                        proactivelyReported: true,
                        nonControllable: false
                    },
                    capabilityResources: {
                        friendlyNames: [
                            {
                                '@type': "text",
                                value: {
                                    text: "mode",
                                    locale: "en-US"
                                }
                            }
                        ]
                    },
                    configuration: {
                        ordered: false,
                        supportedModes: [
                            {
                                value: "RoomThermostat.Normal",
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "normal",
                                                locale: "en-US"
                                            }
                                        },
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "no quickmode",
                                                locale: "en-US"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                value: "RoomThermostat.Party",
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "party",
                                                locale: "en-US"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                value: "RoomThermostat.VentilationBoost",
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "ventilation boost",
                                                locale: "en-US"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                value: "RoomThermostat.DayAtHome",
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "at home",
                                                locale: "en-US"
                                            }
                                        },
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "one day at home",
                                                locale: "en-US"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                value: "RoomThermostat.AwayFromHome",
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "away from home",
                                                locale: "en-US"
                                            }
                                        },
                                        {
                                            '@type': "text",
                                            value: {
                                                text: "one day away",
                                                locale: "en-US"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    type: "AlexaInterface",
                    interface: "Alexa",
                    version: "3"
                }
            ]
        });
    });
});

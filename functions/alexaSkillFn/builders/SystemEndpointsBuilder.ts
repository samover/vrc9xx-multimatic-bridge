import { SystemModel, ZoneModel } from 'models';

export class SystemEndpointsBuilder {
    public static build(system: SystemModel) {
        return {
            endpointId: `${system.id}:system`,
            manufacturerName: system.manufacturer,
            description: system.controller,
            friendlyName: `${system.name} thermostat`,
            displayCategories: ['THERMOSTAT', 'TEMPERATURE_SENSOR'],
            cookie: {},
            capabilities: [
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.ModeController',
                    instance: 'Thermostat.QuickMode',
                    version: '3',
                    properties: {
                        supported: [
                            {
                                name: 'mode'
                            }
                        ],
                        retrievable: true,
                        proactivelyReported: true,
                        nonControllable: false
                    },
                    capabilityResources: {
                        friendlyNames: [
                            {
                                '@type': 'text',
                                value: {
                                    text: 'mode',
                                    locale: 'en-US'
                                }
                            },
                        ]
                    },
                    configuration: {
                        ordered: false,
                        supportedModes: [
                            {
                                value: 'Thermostat.Normal',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'normal',
                                                locale: 'en-US'
                                            }
                                        },
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'no quickmode',
                                                locale: 'en-US'
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                value: 'Thermostat.Party',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'party',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                value: 'Thermostat.VentilationBoost',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'ventilation boost',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                value: 'Thermostat.DayAtHome',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'at home',
                                                locale: 'en-US'
                                            }
                                        },
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'one day at home',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                value: 'Thermostat.AwayFromHome',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'away from home',
                                                locale: 'en-US'
                                            }
                                        },
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'one day away',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                        ]
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.ModeController',
                    instance: 'Thermostat.EcoMode',
                    version: '3',
                    properties: {
                        supported: [
                            {
                                name: 'ecoMode'
                            }
                        ],
                        retrievable: true,
                        proactivelyReported: true,
                        nonControllable: false
                    },
                    capabilityResources: {
                        friendlyNames: [
                            {
                                '@type': 'text',
                                value: {
                                    text: 'ecoMode',
                                    locale: 'en-US'
                                }
                            },
                        ]
                    },
                    configuration: {
                        ordered: false,
                        supportedModes: [
                            {
                                value: 'Thermostat.On',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'on',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                value: 'Thermostat.Off',
                                modeResources: {
                                    friendlyNames: [
                                        {
                                            '@type': 'text',
                                            value: {
                                                text: 'off',
                                                locale: 'en-US'
                                            }
                                        },
                                    ]
                                }
                            },
                        ]
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.TemperatureSensor',
                    version: '3',
                    properties: {
                        supported: [
                            { name: 'temperature' }
                        ],
                        proactivelyReported: true,
                        retrievable: true,
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa.EndpointHealth',
                    version: '3',
                    properties: {
                        supported: [
                            { name: 'connectivity' }
                        ],
                        proactivelyReported: true,
                        retrievable: true
                    }
                },
                {
                    type: 'AlexaInterface',
                    interface: 'Alexa',
                    version: '3',
                }
            ]
        };
    }
}

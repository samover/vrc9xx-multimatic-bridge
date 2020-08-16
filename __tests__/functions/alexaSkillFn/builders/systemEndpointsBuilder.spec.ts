import { systemModel } from '../../../__helpers/fixtures';
import { SystemEndpointsBuilder } from '../../../../functions/alexaSkillFn/builders/SystemEndpointsBuilder';

describe('SystemeEndpointsBuilder', () => {
    const system = systemModel.build();

    it('builds systemEndpoint', () => {
        expect(new SystemEndpointsBuilder().build(system)).toEqual([
            {
                endpointId: `${system.id}:outside-sensor`,
                manufacturerName: system.manufacturer,
                description: system.controller,
                friendlyName: 'Outside temperature sensor',
                displayCategories: [
                    'TEMPERATURE_SENSOR',
                ],
                cookie: {},
                capabilities: [
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
                        interface: "Alexa",
                        version: "3"
                    }
                ]
            },
            {
                endpointId: `${system.id}:system`,
                manufacturerName: system.manufacturer,
                description: system.controller,
                friendlyName: `${system.name} thermostat`,
                displayCategories: [
                    'OTHER',
                ],
                cookie: {},
                capabilities: [
                    {
                        type: "AlexaInterface",
                        interface: "Alexa.ModeController",
                        instance: "Thermostat.QuickMode",
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
                                        text: "override",
                                        locale: "en-US"
                                    }
                                },
                                {
                                    '@type': "text",
                                    value: {
                                        text: "quick mode",
                                        locale: "en-US"
                                    }
                                }
                            ]
                        },
                        configuration: {
                            ordered: false,
                            supportedModes: [
                                {
                                    value: "QuickMode.Normal",
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
                                    value: "QuickMode.Party",
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
                                    value: "QuickMode.VentilationBoost",
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
                                    value: "QuickMode.DayAtHome",
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
                                    value: "QuickMode.AwayFromHome",
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
                        interface: "Alexa.ModeController",
                        instance: "Thermostat.EcoMode",
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
                                        text: "eco mode",
                                        locale: "en-US"
                                    }
                                }
                            ]
                        },
                        configuration: {
                            ordered: false,
                            supportedModes: [
                                {
                                    value: "EcoMode.On",
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': "text",
                                                value: {
                                                    text: "on",
                                                    locale: "en-US"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    value: "EcoMode.Off",
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': "text",
                                                value: {
                                                    text: "off",
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
                        interface: "Alexa",
                        version: "3"
                    }
                ]
            }]);
    });
});

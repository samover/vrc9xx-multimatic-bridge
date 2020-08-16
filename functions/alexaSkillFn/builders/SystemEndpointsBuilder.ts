import { SystemModel, ZoneModel } from 'models';
import { MODE_CONTROLLER_VALUES, NAMESPACES } from '../common/constants/alexaEvent.constants';

export class SystemEndpointsBuilder {
    // eslint-disable-next-line max-lines-per-function
    public build(system: SystemModel) {
        return [
            {
                endpointId: `${system.id}:outside-sensor`,
                manufacturerName: system.manufacturer,
                description: system.controller,
                friendlyName: 'Outside temperature sensor',
                displayCategories: ['TEMPERATURE_SENSOR'],
                cookie: {},
                capabilities: [
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa.TemperatureSensor',
                        version: '3',
                        properties: {
                            supported: [
                                { name: 'temperature' },
                            ],
                            proactivelyReported: true,
                            retrievable: true,
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa.EndpointHealth',
                        version: '3',
                        properties: {
                            supported: [
                                { name: 'connectivity' },
                            ],
                            proactivelyReported: true,
                            retrievable: true,
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa',
                        version: '3',
                    },
                ],
            },
            {
                endpointId: `${system.id}:system`,
                manufacturerName: system.manufacturer,
                description: system.controller,
                friendlyName: `${system.name} thermostat`,
                displayCategories: ['OTHER'],
                cookie: {},
                capabilities: [
                    {
                        type: 'AlexaInterface',
                        interface: NAMESPACES.AlexaModeController,
                        instance: NAMESPACES.ThermostatQuickMode,
                        version: '3',
                        properties: {
                            supported: [
                                { name: 'mode' },
                            ],
                            retrievable: true,
                            proactivelyReported: true,
                            nonControllable: false,
                        },
                        capabilityResources: {
                            friendlyNames: [
                                {
                                    '@type': 'text',
                                    value: { text: 'override', locale: 'en-US' },
                                },
                                {
                                    '@type': 'text',
                                    value: { text: 'quick mode', locale: 'en-US' },
                                },
                            ],
                        },
                        configuration: {
                            ordered: false,
                            supportedModes: [
                                {
                                    value: MODE_CONTROLLER_VALUES.QuickModeNormal,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'normal', locale: 'en-US' },
                                            },
                                            {
                                                '@type': 'text',
                                                value: { text: 'no quickmode', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    value: MODE_CONTROLLER_VALUES.QuickModeParty,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'party', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    value: MODE_CONTROLLER_VALUES.QuickModeVentilationBoost,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'ventilation boost', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    value: MODE_CONTROLLER_VALUES.QuickModeDayAtHome,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'at home', locale: 'en-US' },
                                            },
                                            {
                                                '@type': 'text',
                                                value: { text: 'one day at home', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    value: MODE_CONTROLLER_VALUES.QuickModeAwayFromHome,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'away from home', locale: 'en-US' },
                                            },
                                            {
                                                '@type': 'text',
                                                value: { text: 'one day away', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: NAMESPACES.AlexaModeController,
                        instance: NAMESPACES.ThermostatEcoMode,
                        version: '3',
                        properties: {
                            supported: [
                                {
                                    name: 'mode',
                                },
                            ],
                            retrievable: true,
                            proactivelyReported: true,
                            nonControllable: false,
                        },
                        capabilityResources: {
                            friendlyNames: [
                                {
                                    '@type': 'text',
                                    value: { text: 'eco mode', locale: 'en-US' },
                                },
                            ],
                        },
                        configuration: {
                            ordered: false,
                            supportedModes: [
                                {
                                    value: MODE_CONTROLLER_VALUES.EcoModeOn,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'on', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    value: MODE_CONTROLLER_VALUES.EcoModeOff,
                                    modeResources: {
                                        friendlyNames: [
                                            {
                                                '@type': 'text',
                                                value: { text: 'off', locale: 'en-US' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa.EndpointHealth',
                        version: '3',
                        properties: {
                            supported: [
                                { name: 'connectivity' },
                            ],
                            proactivelyReported: true,
                            retrievable: true,
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa',
                        version: '3',
                    },
                ],
            },
        ];
    }
}

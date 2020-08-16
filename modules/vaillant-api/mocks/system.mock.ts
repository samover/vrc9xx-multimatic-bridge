import {
    SystemQuickModeApiModel, QuickModeApiEnum, SystemApiModel,
} from '../common/interfaces/systemApiModel.interface';

export const mockQuickMode: SystemQuickModeApiModel = {
    quickmode: QuickModeApiEnum.NO_QUICK_MODE,
    duration: 0,
};

export const mockSystemDetails: SystemApiModel = {
    zones: [
        {
            heating: {
                configuration: {
                    mode: 'AUTO',
                    setback_temperature: 17.5,
                    setpoint_temperature: 5.0,
                },
                timeprogram: {
                    friday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '06:00', setting: 'DAY' },
                        { startTime: '09:00', setting: 'NIGHT' },
                        { startTime: '18:00', setting: 'DAY' },
                        { startTime: '21:00', setting: 'NIGHT' },
                    ],
                    monday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '06:00', setting: 'DAY' },
                        { startTime: '09:00', setting: 'NIGHT' },
                        { startTime: '18:00', setting: 'DAY' },
                        { startTime: '21:00', setting: 'NIGHT' },
                    ],
                    tuesday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '06:00', setting: 'DAY' },
                        { startTime: '09:00', setting: 'NIGHT' },
                        { startTime: '18:00', setting: 'DAY' },
                        { startTime: '21:00', setting: 'NIGHT' },
                    ],
                    wednesday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '06:00', setting: 'DAY' },
                        { startTime: '09:00', setting: 'NIGHT' },
                        { startTime: '18:00', setting: 'DAY' },
                        { startTime: '21:00', setting: 'NIGHT' },
                    ],
                    saturday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '08:00', setting: 'DAY' },
                        { startTime: '23:00', setting: 'NIGHT' },
                    ],
                    sunday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '08:00', setting: 'DAY' },
                        { startTime: '23:00', setting: 'NIGHT' },
                    ],
                    thursday: [
                        { startTime: '00:00', setting: 'NIGHT' },
                        { startTime: '06:00', setting: 'DAY' },
                        { startTime: '09:00', setting: 'NIGHT' },
                        { startTime: '18:00', setting: 'DAY' },
                        { startTime: '21:00', setting: 'NIGHT' },
                    ],
                },
            },
            configuration: {
                name: 'HOME      ',
                enabled: true,
                active_function: 'STANDBY',
                inside_temperature: 21.4,
                quick_veto: { active: false, setpoint_temperature: 21.5 },
            },
            currently_controlled_by: { name: 'RBR' },
            _id: 'Control_ZO1',
        },
    ],
    configuration: {
        eco_mode: true,
        holidaymode: {
            active: false,
            start_date: '2020-03-14',
            end_date: '2020-03-18',
            temperature_setpoint: 15.0,
        },
    },
    status: {
        datetime: new Date(),
        outside_temperature: 10.4,
    },
    dhw: [
        {
            hotwater: {
                configuration: {
                    operation_mode: 'OFF',
                    temperature_setpoint: 55.0,
                },
                timeprogram: {
                    friday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '06:00', mode: 'ON' },
                        { startTime: '09:00', mode: 'OFF' },
                        { startTime: '18:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    monday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '06:00', mode: 'ON' },
                        { startTime: '09:00', mode: 'OFF' },
                        { startTime: '18:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    tuesday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '06:00', mode: 'ON' },
                        { startTime: '09:00', mode: 'OFF' },
                        { startTime: '18:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    wednesday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '06:00', mode: 'ON' },
                        { startTime: '09:00', mode: 'OFF' },
                        { startTime: '18:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    saturday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '08:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    sunday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '08:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                    thursday: [
                        { startTime: '00:00', mode: 'OFF' },
                        { startTime: '06:00', mode: 'ON' },
                        { startTime: '09:00', mode: 'OFF' },
                        { startTime: '18:00', mode: 'ON' },
                        { startTime: '22:30', mode: 'OFF' },
                    ],
                },
            },
            circulation: {
                configuration: {
                    operationMode: 'AUTO',
                },
                timeprogram: {
                    friday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '06:00', setting: 'ON' },
                        { startTime: '09:00', setting: 'OFF' },
                        { startTime: '18:00', setting: 'ON' },
                        { startTime: '22:30', setting: 'OFF' },
                    ],
                    monday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '06:00', setting: 'ON' },
                        { startTime: '09:00', setting: 'OFF' },
                        { startTime: '18:00', setting: 'ON' },
                        { startTime: '22:30', setting: 'OFF' },
                    ],
                    tuesday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '06:00', setting: 'ON' },
                        { startTime: '09:00', setting: 'OFF' },
                        { startTime: '18:00', setting: 'ON' },
                        { startTime: '22:30', setting: 'OFF' },
                    ],
                    wednesday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '06:00', setting: 'ON' },
                        { startTime: '09:00', setting: 'OFF' },
                        { startTime: '18:00', setting: 'ON' },
                        { startTime: '22:30', setting: 'OFF' },
                    ],
                    saturday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '08:00', setting: 'ON' },
                        { startTime: '11:00', setting: 'OFF' },
                    ],
                    sunday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '08:00', setting: 'ON' },
                        { startTime: '11:00', setting: 'OFF' },
                    ],
                    thursday: [
                        { startTime: '00:00', setting: 'OFF' },
                        { startTime: '06:00', setting: 'ON' },
                        { startTime: '09:00', setting: 'OFF' },
                        { startTime: '18:00', setting: 'ON' },
                        { startTime: '22:30', setting: 'OFF' },
                    ],
                },
            },
            _id: 'Control_DHW',
        },
    ],
};

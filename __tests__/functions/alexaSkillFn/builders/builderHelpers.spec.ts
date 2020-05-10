import { SystemOverrideEnum } from 'models';
import { parseQuickmodeValue, parseThermostatMode } from '../../../../functions/alexaSkillFn/builders/builderHelpers';
import { MODE_CONTROLLER_VALUES } from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';

describe('builderHelpers', () => {
    describe('parseThermostatMode', () => {
        it('parses AUTO to AUTO', () => {
            expect(parseThermostatMode('AUTO')).toEqual('AUTO');
        });
        it('parses OFF to OFF', () => {
            expect(parseThermostatMode('OFF')).toEqual('OFF');
        });
        it('parses HEAT to HEAT', () => {
            expect(parseThermostatMode('HEAT')).toEqual('HEAT');
        });
        it('parses all other values to HEAT', () => {
            expect(parseThermostatMode('OTHER')).toEqual('HEAT');
        });
    });

    describe('parseQuickmodeValue', () => {
        it(`parses ${SystemOverrideEnum.DayAtHome} to ${MODE_CONTROLLER_VALUES.QuickModeDayAtHome}`, () => {
            expect(parseQuickmodeValue(SystemOverrideEnum.DayAtHome)).toEqual(MODE_CONTROLLER_VALUES.QuickModeDayAtHome);
        });
        it(`parses ${SystemOverrideEnum.DayAwayFromHome} to ${MODE_CONTROLLER_VALUES.QuickModeAwayFromHome}`, () => {
            expect(parseQuickmodeValue(SystemOverrideEnum.DayAwayFromHome)).toEqual(MODE_CONTROLLER_VALUES.QuickModeAwayFromHome);
        });
        it(`parses ${SystemOverrideEnum.None} to ${MODE_CONTROLLER_VALUES.QuickModeNormal}`, () => {
            expect(parseQuickmodeValue(SystemOverrideEnum.None)).toEqual(MODE_CONTROLLER_VALUES.QuickModeNormal);
        });
        it(`parses ${SystemOverrideEnum.Party} to ${MODE_CONTROLLER_VALUES.QuickModeParty}`, () => {
            expect(parseQuickmodeValue(SystemOverrideEnum.Party)).toEqual(MODE_CONTROLLER_VALUES.QuickModeParty);
        });
        it(`parses ${SystemOverrideEnum.VentilationBoost} to ${MODE_CONTROLLER_VALUES.QuickModeVentilationBoost}`, () => {
            expect(parseQuickmodeValue(SystemOverrideEnum.VentilationBoost)).toEqual(MODE_CONTROLLER_VALUES.QuickModeVentilationBoost);
        });
        it(`returns default value ${MODE_CONTROLLER_VALUES.QuickModeNormal}`, () => {
            // @ts-ignore
            expect(parseQuickmodeValue('unknown')).toEqual(MODE_CONTROLLER_VALUES.QuickModeNormal);
        });
    });
});

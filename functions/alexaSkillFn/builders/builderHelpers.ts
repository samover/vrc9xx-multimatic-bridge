import { SystemOverrideEnum } from 'models';
import { MODE_CONTROLLER_VALUES } from '../common/constants/alexaEvent.constants';

export const parseThermostatMode = (operationMode: string): string => {
    if (operationMode === 'AUTO') { return 'AUTO'; }
    if (operationMode === 'OFF') { return 'OFF'; }
    return 'HEAT';
};

export const parseQuickmodeValue = (systemOverride: SystemOverrideEnum): string => {
    if (systemOverride === SystemOverrideEnum.DayAtHome) {
        return MODE_CONTROLLER_VALUES.QuickModeDayAtHome;
    }
    if (systemOverride === SystemOverrideEnum.DayAwayFromHome) {
        return MODE_CONTROLLER_VALUES.QuickModeAwayFromHome;
    }
    if (systemOverride === SystemOverrideEnum.None) {
        return MODE_CONTROLLER_VALUES.QuickModeNormal;
    }
    if (systemOverride === SystemOverrideEnum.Party) {
        return MODE_CONTROLLER_VALUES.QuickModeParty;
    }
    if (systemOverride === SystemOverrideEnum.VentilationBoost) {
        return MODE_CONTROLLER_VALUES.QuickModeVentilationBoost;
    }

    return MODE_CONTROLLER_VALUES.QuickModeNormal;
};

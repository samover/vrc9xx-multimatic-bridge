/* eslint-disable max-len */
const BASE = 'https://smart.vaillant.com/mobile/api/v4';

const BASE_AUTHENTICATE = `${BASE}/account/authentication/v1`;
const AUTHENTICATE = `${BASE_AUTHENTICATE}/authenticate`;
const NEW_TOKEN = `${BASE_AUTHENTICATE}/token/new`;
const LOGOUT = `${BASE_AUTHENTICATE}/logout`;

// FacilityApiModel details//
const FACILITIES_LIST = `${BASE}/facilities`;
const FACILITIES = `${FACILITIES_LIST}/{serialNumber}`;
const FACILITIES_DETAILS = `${FACILITIES}/system/v1/details`;
const FACILITIES_STATUS = `${FACILITIES}/system/v1/status`;
const FACILITIES_SETTINGS = `${FACILITIES}/storage`;
const FACILITIES_DEFAULT_SETTINGS = `${FACILITIES}/storage/default`;
const FACILITIES_INSTALLER_INFO = `${FACILITIES}/system/v1/installerinfo`;

// Rbr (Room by room)//
const RBR_BASE = `${FACILITIES}/rbr/v1`;
const RBR_INSTALLATION_STATUS = `${RBR_BASE}/installationStatus`;
const RBR_UNDERFLOOR_HEATING_STATUS = `${RBR_BASE}/underfloorHeatingStatus`;

// Rooms//
const ROOMS_LIST = `${RBR_BASE}/rooms`;
const ROOM = `${ROOMS_LIST}/{roomId}`;
const ROOM_CONFIGURATION = `${ROOMS_LIST}/{roomId}/configuration`;
const ROOM_QUICK_VETO = `${ROOM_CONFIGURATION}/quickVeto`;
const ROOM_TIMEPROGRAM = `${ROOMS_LIST}/{roomId}/timeprogram`;
const ROOM_OPERATING_MODE = `${ROOM_CONFIGURATION}/operationMode`;
const ROOM_CHILD_LOCK = `${ROOM_CONFIGURATION}/childLock`;
const ROOM_NAME = `${ROOM_CONFIGURATION}/name`;
const ROOM_DEVICE_NAME = `${ROOM_CONFIGURATION}/devices/{sgtin}/name`;
const ROOM_TEMPERATURE_SETPOINT = `${ROOM_CONFIGURATION}/temperatureSetpoint`;

// Repeaters//
const REPEATERS_LIST = `${RBR_BASE}/repeaters`;
const REPEATER_DELETE = `${REPEATERS_LIST}/{sgtin}`;
const REPEATER_SET_NAME = `${REPEATERS_LIST}/{sgtin}/name`;

// HVAC (heating, ventilation and Air-conditioning)//
const HVAC = `${FACILITIES}/hvacstate/v1/overview`;
const HVAC_REQUEST_UPDATE = `${FACILITIES}/hvacstate/v1/hvacMessages/update`;

// EMF (Embedded Metering Function)//
const LIVE_REPORT = `${FACILITIES}/livereport/v1`;
const LIVE_REPORT_DEVICE = `${LIVE_REPORT}/devices/{deviceId}/reports/{reportId}`;
const PHOTOVOLTAICS_REPORT = `${FACILITIES}/spine/v1/currentPVMeteringInfo`;
const EMF_REPORT = `${FACILITIES}/emf/v1/devices`;
const EMF_REPORT_DEVICE = `${EMF_REPORT}/{deviceId}`;

// System control//
const SYSTEM = `${FACILITIES}/systemcontrol/v1`;
const SYSTEM_CONFIGURATION = `${SYSTEM}/configuration`;
const SYSTEM_STATUS = `${SYSTEM}/status`;
const SYSTEM_DATETIME = `${SYSTEM_STATUS}/datetime`;
const SYSTEM_PARAMETERS = `${SYSTEM}/parameters`;
const SYSTEM_QUICK_MODE = `${SYSTEM_CONFIGURATION}/quickmode`;
const SYSTEM_HOLIDAY_MODE = `${SYSTEM_CONFIGURATION}/holidaymode`;

// DHW (Domestic Hot Water)//
const DHW = `${SYSTEM}/dhw/{dhwId}`;

// Circulation//
const CIRCULATION = `${DHW}/circulation`;
const CIRCULATION_CONFIGURATION = `${CIRCULATION}/configuration`;
const CIRCULATION_TIMEPROGRAM = `${CIRCULATION_CONFIGURATION}/timeprogram`;

// Hot water//
const HOT_WATER = `${DHW}/hotwater`;
const HOT_WATER_CONFIGURATION = `${HOT_WATER}/configuration`;
const HOT_WATER_TIMEPROGRAM = `${HOT_WATER_CONFIGURATION}/timeprogram`;
const HOT_WATER_OPERATING_MODE = `${HOT_WATER_CONFIGURATION}/operationMode`;
const HOT_WATER_TEMPERATURE_SETPOINT = `${HOT_WATER_CONFIGURATION}/temperatureSetpoint`;

// Ventilation//
const VENTILATION = `${SYSTEM}/ventilation/{ventilationId}`;
const VENTILATION_CONFIGURATION = `${VENTILATION}/fan/configuration`;
const VENTILATION_TIMEPROGRAM = `${VENTILATION_CONFIGURATION}/timeprogram`;
const VENTILATION_DAY_LEVEL = `${VENTILATION_CONFIGURATION}/dayLevel`;
const VENTILATION_NIGHT_LEVEL = `${VENTILATION_CONFIGURATION}/nightLevel`;
const VENTILATION_OPERATING_MODE = `${VENTILATION_CONFIGURATION}/operationMode`;

// Zones//
const ZONES_LIST = `${SYSTEM}/zones`;
const ZONE = `${ZONES_LIST}/{zoneId}`;
const ZONE_CONFIGURATION = `${ZONE}/configuration`;
const ZONE_NAME = `${ZONE_CONFIGURATION}/name`;
const ZONE_QUICK_VETO = `${ZONE_CONFIGURATION}/quickVeto`;

// Zone heating//
const ZONE_HEATING_CONFIGURATION = `${ZONE}/heating/configuration`;
const ZONE_HEATING_TIMEPROGRAM = `${ZONE}/heating/timeprogram`;
const ZONE_HEATING_MODE = `${ZONE_HEATING_CONFIGURATION}/mode`;
const ZONE_HEATING_SETPOINT_TEMPERATURE = `${ZONE_HEATING_CONFIGURATION}/setpointTemperature`;
const ZONE_HEATING_SETBACK_TEMPERATURE = `${ZONE_HEATING_CONFIGURATION}/setbackTemperature`;

// Zone cooling//
const ZONE_COOLING_CONFIGURATION = `${ZONE}/cooling/configuration`;
const ZONE_COOLING_TIMEPROGRAM = `${ZONE}/cooling/timeprogram`;
const ZONE_COOLING_MODE = `${ZONE_COOLING_CONFIGURATION}/mode`;
const ZONE_COOLING_SETPOINT_TEMPERATURE = `${ZONE_COOLING_CONFIGURATION}/setpointTemperature`;
const ZONE_COOLING_MANUAL_SETPOINT_TEMPERATURE = `${ZONE_COOLING_CONFIGURATION}/manualModeCoolingTemperatureSetpoint`;

const formatUrl = (url: string, object: any): string => {
    let formattedUrl = url;

    Object.keys(object).forEach((key) => {
        formattedUrl = formattedUrl.replace(`{${key}}`, object[key]);
    });

    return formattedUrl;
};

export class ApiPath {
// Url to request a new token.
    public static newToken = (): string => NEW_TOKEN;


    // Url to authenticate the user and receive cookies.//
    public static authenticate = (): string => AUTHENTICATE;


    // Url to logout from the API, cookies are invalidated.//
    public static logout = (): string => LOGOUT;


    // Url to get the list of serial numbers of the facilities (and some other properties).
    public static facilitiesList = (): string => FACILITIES_LIST;


    // Url to check if underfloor heating is installed or not.//
    public static rbrUnderfloorHeatingStatus = (serialNumber: string): string => formatUrl(RBR_UNDERFLOOR_HEATING_STATUS, { serialNumber });


    // Url to check the room by room installation status.//
    public static rbrInstallationStatus = (serialNumber: string): string => formatUrl(RBR_INSTALLATION_STATUS, { serialNumber });

    // Url to get the list of :class:`~pymultimatic.model.component.Room`.//
    public static rooms = (serialNumber: string): string => formatUrl(ROOMS_LIST, { serialNumber });


    // Url to get specific room details (configuration, timeprogram). Or to delete a :class:`~pymultimatic.model.component.Room`.
    public static room = (serialNumber: string, roomId: string): string => formatUrl(ROOM, { serialNumber, roomId });


    // Url to get configuration for a :class:`~pymultimatic.model.component.Room` (name, temperature, target temperature, etc.).
    public static roomConfiguration = (serialNumber: string, roomId: string): string => formatUrl(ROOM_CONFIGURATION, { serialNumber, roomId });

    // Url to handle :class:`~pymultimatic.model.mode.QuickVeto` for a :class:`~pymultimatic.model.component.Room`.
    public static roomQuickVeto = (serialNumber: string, roomId: string): string => formatUrl(ROOM_QUICK_VETO, { serialNumber, roomId });

    // Url to set operating for a :class:`~pymultimatic.model.component.Room`.
    public static roomOperatingMode = (serialNumber: string, roomId: string): string => formatUrl(ROOM_OPERATING_MODE, { serialNumber, roomId });

    // Url to get/update configuration for a class:`~pymultimatic.model.component.Room`. (name, temperature, target temperature, etc.).
    public static roomTimeprogramme = (serialNumber: string, roomId: string): string => formatUrl(ROOM_TIMEPROGRAM, { serialNumber, roomId });

    // Url to handle child lock for all :class:`~pymultimatic.model.component.Device` in a :class:`~pymultimatic.model.component.Room`.
    public static roomChildLock = (serialNumber: string, roomId: string): string => formatUrl(ROOM_CHILD_LOCK, { serialNumber, roomId });

    // Set :class:`~pymultimatic.model.component.Room` name.//
    public static roomName = (serialNumber: string, roomId: string): string => formatUrl(ROOM_NAME, { serialNumber, roomId });

    // Set :class:`~pymultimatic.model.component.Device` name.//
    public static roomDeviceName = (serialNumber: string, roomId: string, sgtin: string): string => formatUrl(ROOM_DEVICE_NAME, { serialNumber, roomId, sgtin });

    // Url to handle target temperature for a :class:`~pymultimatic.model.component.Room`. //
    public static roomTemperatureSetpoint = (serialNumber: string, roomId: string): string => formatUrl(ROOM_TEMPERATURE_SETPOINT, { serialNumber, roomId });

    // Url to get list of repeaters//
    public static repeaters = (serialNumber: string): string => formatUrl(REPEATERS_LIST, { serialNumber });

    // Url to delete a repeater.//
    public static deleteRepeater = (serialNumber: string, sgtin: string): string => formatUrl(REPEATER_DELETE, { serialNumber, sgtin });

    // Url to set repeater's name.//
    public static repeaterName = (serialNumber: string, sgtin: string): string => formatUrl(REPEATER_SET_NAME, { serialNumber, sgtin });

    // Url of the hvac overview.//
    public static hvac = (serialNumber: string): string => formatUrl(HVAC, { serialNumber });

    // Url to request an hvac update.//
    public static hvacUpdate = (serialNumber: string): string => formatUrl(HVAC_REQUEST_UPDATE, { serialNumber });

    // Url to get live report data (current boiler water temperature, current hot water temperature, etc.).//
    public static liveReport = (serialNumber: string): string => formatUrl(LIVE_REPORT, { serialNumber });

    // Url to get live report for specific device //
    public static liveReportDevice = (serialNumber: string, deviceId: string, reportId: string): string => formatUrl(LIVE_REPORT_DEVICE, { serialNumber, deviceId, reportId });

    // Url to get photovoltaics data.//
    public static photovoltaics = (serialNumber: string): string => formatUrl(PHOTOVOLTAICS_REPORT, { serialNumber });

    // Url to get emf (Embedded Metering Function) report.//
    public static emfReport = (serialNumber: string): string => formatUrl(EMF_REPORT, { serialNumber });


    // Url to get emf (Embedded Metering Function) report for a specific device.//
    public static emfReportDevice = (serialNumber: string, deviceId: string, energyType: string, functionName: string, timeRange: string, start: string, offset: string): string => {
        const params = new URLSearchParams({
            energyType, function: functionName, timeRange, start, offset,
        });
        return `${formatUrl(EMF_REPORT_DEVICE, { serialNumber, deviceId })}?${params}`;
    };

    // Url to get facility detail.//
    public static facilitiesDetails = (serialNumber: string): string => formatUrl(FACILITIES_DETAILS, { serialNumber });


    // Url to get facility status.//
    public static facilitiesStatus = (serialNumber: string): string => formatUrl(FACILITIES_STATUS, { serialNumber });


    // Url to get facility settings.//
    public static facilitiesSettings = (serialNumber: string): string => formatUrl(FACILITIES_SETTINGS, { serialNumber });

    // Url to get facility default settings //
    public static facilitiesDefaultSettings = (serialNumber: string): string => formatUrl(FACILITIES_DEFAULT_SETTINGS, { serialNumber });

    // Url to get facility default settings.//
    public static facilitiesInstallerInfo = (serialNumber: string): string => formatUrl(FACILITIES_INSTALLER_INFO, { serialNumber });

    // Url to get full :class:`~pymultimatic.model.system.System` (zones, dhw, ventilation, holiday mode, etc.) except :class:`~pymultimatic.model.component.Room`. //
    public static system = (serialNumber: string): string => formatUrl(SYSTEM, { serialNumber });

    // Url to get system configuration (holiday mode, quick mode etc.).//
    public static systemConfiguration = (serialNumber: string): string => formatUrl(SYSTEM_CONFIGURATION, { serialNumber });

    // Url to get outdoor temperature and datetime.//
    public static systemStatus = (serialNumber: string): string => formatUrl(SYSTEM_STATUS, { serialNumber });

    // Url to set datetime.//
    public static systemDatetime = (serialNumber: string): string => formatUrl(SYSTEM_DATETIME, { serialNumber });

    // Url to get system parameters.//
    public static systemParameters = (serialNumber: string): string => formatUrl(SYSTEM_PARAMETERS, { serialNumber });

    // Url to get system :class:`~pymultimatic.model.mode.QuickMode`.//
    public static systemQuickmode = (serialNumber: string): string => formatUrl(SYSTEM_QUICK_MODE, { serialNumber });

    // Url to get system :class:`~pymultimatic.model.mode.HolidayMode`.//
    public static systemHolidayMode = (serialNumber: string): string => formatUrl(SYSTEM_HOLIDAY_MODE, { serialNumber });

    // Url to get domestic hot water (:class:`~pymultimatic.model.component.HotWater` and :class:`~pymultimatic.model.component.Circulation`). //
    public static dhw = (serialNumber: string, dhwId: string): string => formatUrl(DHW, { serialNumber, dhwId });

    // Url to get :class:`~pymultimatic.model.component.Circulation` details. //
    public static circulation = (serialNumber: string, dhwId: string): string => formatUrl(CIRCULATION, { serialNumber, dhwId });

    // Url to handle :class:`~pymultimatic.model.component.Circulation` configuration. //
    public static circulationConfiguration = (serialNumber: string, dhwId: string): string => formatUrl(CIRCULATION_CONFIGURATION, { serialNumber, dhwId });

    // Url to handle :class:`~pymultimatic.model.component.Circulation` :class:`~pymultimatic.model.timeprogram.TimeProgram`. //
    public static circulationTimeprogram = (serialNumber: string, dhwId: string): string => formatUrl(CIRCULATION_TIMEPROGRAM, { serialNumber, dhwId });

    // Url to get :class:`~pymultimatic.model.component.HotWater` detail.//
    public static hotWater = (serialNumber: string, dhwId: string): string => formatUrl(HOT_WATER, { serialNumber, dhwId });

    // Url to handle :class:`~pymultimatic.model.component.HotWater` configuration. //
    public static hotWaterConfiguration = (serialNumber: string, dhwId: string): string => formatUrl(HOT_WATER_CONFIGURATION, { serialNumber, dhwId });

    // Url to handle :class:`~pymultimatic.model.component.HotWater` :class:`~pymultimatic.model.timeprogram.TimeProgram`. //
    public static hotWaterTimeprogram = (serialNumber: string, dhwId: string): string => formatUrl(HOT_WATER_TIMEPROGRAM, { serialNumber, dhwId });

    // Url to set :class:`~pymultimatic.model.component.HotWater` operating mode, only if it's not a quick action. //
    public static hotWaterOperatingMode = (serialNumber: string, dhwId: string): string => formatUrl(HOT_WATER_OPERATING_MODE, { serialNumber, dhwId });

    // Url to set :class:`~pymultimatic.model.component.HotWater` temperature setpoint. //
    public static hotWaterTemperatureSetpoint = (serialNumber: string, dhwId: string): string => formatUrl(HOT_WATER_TEMPERATURE_SETPOINT, { serialNumber, dhwId });

    // Url to get ventilation details.//
    public static ventilation = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION, { serialNumber, ventilationId });

    // Url to get ventilation configuration.//
    public static ventilationConfiguration = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION_CONFIGURATION, { serialNumber, ventilationId });

    // Url to get ventilation timeprogram.//
    public static ventilationTimeprogram = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION_TIMEPROGRAM, { serialNumber, ventilationId });

    // Url to set ventilation day level.//
    public static setVentilationDayLevel = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION_DAY_LEVEL, { serialNumber, ventilationId });

    // Url to set ventilation night level //
    public static setVentilationNightLevel = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION_NIGHT_LEVEL, { serialNumber, ventilationId });

    // Url to set ventilation operating mode.//
    public static setVentilationOperatingMode = (serialNumber: string, ventilationId: string): string => formatUrl(VENTILATION_OPERATING_MODE, { serialNumber, ventilationId });

    // Url to get :class:`~pymultimatic.model.component.Zone`.//
    public static zones = (serialNumber: string): string => formatUrl(ZONES_LIST, { serialNumber });

    // Url to get a specific :class:`~pymultimatic.model.component.Zone`.//
    public static zone = (serialNumber: string, zoneId: string): string => formatUrl(ZONE, { serialNumber, zoneId });

    // Url to get a specific :class:`~pymultimatic.model.component.Zone` configuration. //
    public static zoneConfiguration = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_CONFIGURATION, { serialNumber, zoneId });

    // Url to set :class:`~pymultimatic.model.component.Zone` name.//
    public static zoneName = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_NAME, { serialNumber, zoneId });

    // Url to get :class:`~pymultimatic.model.mode.QuickVeto` for a :class:`~pymultimatic.model.component.Zone`. //
    public static zoneQuickVeto = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_QUICK_VETO, { serialNumber, zoneId });

    // Url to get :class:`~pymultimatic.model.component.Zone` heating configuration. //
    public static zoneHeatingConfiguration = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_HEATING_CONFIGURATION, { serialNumber, zoneId });

    // Url to get a :class:`~pymultimatic.model.component.Zone` heating :class:`~pymultimatic.model.timeprogram.TimeProgram`. //
    public static zoneHeatingTimeprogram = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_HEATING_TIMEPROGRAM, { serialNumber, zoneId });

    // Url to get a :class:`~pymultimatic.model.component.Zone` heating mode. //
    public static zoneHeatingMode = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_HEATING_MODE, { serialNumber, zoneId });

    // Url to set a :class:`~pymultimatic.model.component.Zone` setpoint temperature. //
    public static zoneHeatingSetpointTemperature = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_HEATING_SETPOINT_TEMPERATURE, { serialNumber, zoneId });

    // Url to set a :class:`~pymultimatic.model.component.Zone` setback temperature. //
    public static zoneHeatingSetbackTemperature = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_HEATING_SETBACK_TEMPERATURE, { serialNumber, zoneId });

    // Url to get a :class:`~pymultimatic.model.component.Zone` cooling configuration. //
    public static zoneCoolingConfiguration = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_COOLING_CONFIGURATION, { serialNumber, zoneId });

    // Url to get :class:`~pymultimatic.model.component.Zone` cooling timeprogram. //
    public static zoneCoolingTimeprogram = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_COOLING_TIMEPROGRAM, { serialNumber, zoneId });

    // Url to set a :class:`~pymultimatic.model.component.Zone` cooling mode. //
    public static zoneCoolingMode = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_COOLING_MODE, { serialNumber, zoneId });

    // Url to set the cooling temperature setpoint for a :class:`~pymultimatic.model.component.Zone`. //
    public static zoneCoolingSetpointTemperature = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_COOLING_SETPOINT_TEMPERATURE, { serialNumber, zoneId });

    // Url to set manual cooling setpoint temperature for a :class:`~pymultimatic.model.component.Zone`. //
    public static zoneCoolingManualSetpointTemperature = (serialNumber: string, zoneId: string): string => formatUrl(ZONE_COOLING_MANUAL_SETPOINT_TEMPERATURE, { serialNumber, zoneId });
}

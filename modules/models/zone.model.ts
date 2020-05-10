export interface ZoneModel {
    id: string;
    facilityId: string;
    mode: string; // DAY | NIGHT
    name: string;
    insideTemperature: number;
    temperatureSetpoint: number;
    enabled: boolean;
}

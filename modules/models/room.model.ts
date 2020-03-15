export interface RoomModel {
    id: number;
    facilityId: string;
    name: string;
    temperatureSetpoint: number;
    operationMode: string;
    currentTemperature: number;
    childLock: boolean;
    isWindowOpen: boolean;
}

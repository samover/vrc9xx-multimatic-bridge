import * as faker from 'faker';
import {
    Authentication,
    Credentials,
    Facility,
    FacilityApiModel,
    Room,
    RoomApiModel,
    System,
    Zone, ZoneApiModel
} from 'vaillant-api';
import { SystemApiModel, SystemQuickModeApiModel } from '../../modules/vaillant-api/system';
import { MockOf } from '../__helpers/mockOf.type';
import Mock = jest.Mock;

// Authentication
export const loginStub = jest.fn();
export const authenticateStub = jest.fn();
export const authToken = 'authToken';
export const sessionId = 'sessionId';
export const username = faker.internet.userName();
export const smartphoneId = faker.random.uuid();

// Facility
export const getFacilitiesListStub = jest.fn();

// Room
export const getRoomDetailsStub = jest.fn();
export const getRoomsListStub = jest.fn();
export const quickVetoRoomStub = jest.fn();
export const deleteQuickVetoRoomStub = jest.fn();

// Zone
export const getZoneDetailsStub = jest.fn();
export const getZonesListStub = jest.fn();

// System
export const getSystemQuickModeStub = jest.fn();
export const getSystemDetailsStub = jest.fn();

export const MockAuthentication = jest.fn().mockImplementation((): MockOf<Authentication> => ({
    login(...args): Promise<void> {
        return loginStub(...args);
    },
    authenticate(): Promise<void> {
        return authenticateStub();
    },
    getAuthToken: (): string => authToken,
    getSessionId: (): string => sessionId,
    getCredentials: (): Credentials => ({
        username,
        smartphoneId,
        authToken,
        sessionId,
    }),
}));

export const MockFacility = jest.fn().mockImplementation((): MockOf<Facility> => ({
    getList(): Promise<FacilityApiModel[]> {
        return getFacilitiesListStub();
    }
}));

export const MockRoom = jest.fn().mockImplementation((): MockOf<Room> => ({
    getDetails(...args): Promise<RoomApiModel> {
        return getRoomDetailsStub(...args)
    },
    getList(): Promise<RoomApiModel[]> {
        return getRoomsListStub()
    },
   quickVeto(...args): Promise<void> {
        return quickVetoRoomStub(...args);
   } ,
    deleteQuickVeto(...args): Promise<void> {
        return deleteQuickVetoRoomStub(...args);
    }
}));

export const MockSystem = jest.fn().mockImplementation((): MockOf<System> => ({
    getQuickMode: (): Promise<SystemQuickModeApiModel> => {
        return getSystemQuickModeStub();
    },
    getDetails: (): Promise<SystemApiModel> => {
        return getSystemDetailsStub();
    },
}));

export const MockZone = jest.fn().mockImplementation((): MockOf<Zone> => ({
    getDetails(...args): Promise<ZoneApiModel> {
        return getZoneDetailsStub(...args)
    },
    getList(): Promise<ZoneApiModel[]> {
        return getZonesListStub()
    },
}));

jest.mock('vaillant-api', () => ({
    __esModule: true,
    Authentication: MockAuthentication,
    Facility: MockFacility,
    Room: MockRoom,
    System: MockSystem,
    Zone: MockZone,
}));

export const init = () => {
    loginStub.mockResolvedValue(null);
    authenticateStub.mockResolvedValue(null);
};


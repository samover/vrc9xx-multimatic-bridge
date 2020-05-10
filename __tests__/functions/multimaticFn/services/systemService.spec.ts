// MOCKS
import * as faker from 'faker';
import * as vaillantApiMock from '../../../__mocks/vaillantApiMock';

import { SystemService } from '../../../../functions/multimaticFn/services/SystemService';
import { RoomService } from '../../../../functions/multimaticFn/services/RoomService';

const buildSystem = (controlledBy: string = 'RBR') => ({
    zones: [{
        currently_controlled_by: {
            name: controlledBy,
        }
    }]
});

describe('SystemService', () => {
    beforeEach(() => {
        this.facility = { serialNumber: faker.random.uuid() };
        this.systemService = new SystemService(new RoomService());
        this.systemService.buildSystem = jest.fn().mockReturnValue('system');
        this.systemService.buildSystemStatus = jest.fn().mockReturnValue('systemStatus');
        this.systemService.roomService.getRoomList = jest.fn().mockReturnValue(['room']);
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#getSystem', () => {
        it('invokes vaillant.system.getDetails api', async () => {
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(buildSystem('Zone'));

            await this.systemService.getSystem('sessionId', this.facility);

            expect(vaillantApiMock.getSystemDetailsStub).toHaveBeenCalledTimes(1);
        });
        it('builds a system from a system, facility, list of rooms and list of zones', async () => {
            const systemDetails = buildSystem('Zone');
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(systemDetails);

            await expect(this.systemService.getSystem('sessionId', this.facility)).resolves.toEqual('system');
            expect(this.systemService.buildSystem).toHaveBeenCalledWith(systemDetails, this.facility, systemDetails.zones, []);
        });
        it('fetches rooms when zone is controlled by RBR', async () => {
            const systemDetails = buildSystem('RBR');
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(systemDetails);
            vaillantApiMock.getRoomsListStub.mockResolvedValue(['room']);

            await expect(this.systemService.getSystem('sessionId', this.facility)).resolves.toEqual('system');
            expect(this.systemService.roomService.getRoomList).toHaveBeenCalledTimes(1);
            expect(this.systemService.buildSystem).toHaveBeenCalledWith(systemDetails, this.facility, [], ['room']);
        });
    });
    describe('#getSystemStatus', () => {
        it('invokes vaillant.system.getDetails api', async () => {
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(buildSystem());

            await this.systemService.getSystemStatus('sessionId', this.facility);

            expect(vaillantApiMock.getSystemDetailsStub).toHaveBeenCalledTimes(1);
        });
        it('invokes vaillant.system.getQuickMode api', async () => {
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(buildSystem());

            await this.systemService.getSystemStatus('sessionId', this.facility);

            expect(vaillantApiMock.getSystemQuickModeStub).toHaveBeenCalledTimes(1);
        });
        it('builds a systemStatus from systemDetails and systemQuickMode', async () => {
            const systemDetails = buildSystem();
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(systemDetails);
            vaillantApiMock.getSystemQuickModeStub.mockResolvedValue('quickmode');

            await this.systemService.getSystemStatus('sessionId', this.facility);

            expect(this.systemService.buildSystemStatus).toHaveBeenCalledWith(systemDetails, this.facility, 'quickmode');
        });
        it('returns a systemStatus', async () => {
            const systemDetails = buildSystem();
            vaillantApiMock.getSystemDetailsStub.mockResolvedValue(systemDetails);
            vaillantApiMock.getSystemQuickModeStub.mockResolvedValue('quickmode');

            await expect(this.systemService.getSystemStatus('sessionId', this.facility)).resolves.toEqual('systemStatus');
        });
    });
});

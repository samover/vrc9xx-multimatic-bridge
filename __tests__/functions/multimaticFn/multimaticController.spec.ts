import { LambdaProxyEvent, Request } from 'aws-lambda-core';
import { UnauthorizedError, ValidationError } from 'aws-lambda-core/lib/errors';
import { MultimaticController } from '../../../functions/multimaticFn/MultimaticController';
import { AuthenticationService } from '../../../functions/multimaticFn/services/AuthenticationService';
import { FacilityService } from '../../../functions/multimaticFn/services/FacilityService';
import { RoomService } from '../../../functions/multimaticFn/services/RoomService';
import { SystemService } from '../../../functions/multimaticFn/services/SystemService';
import { ZoneService } from '../../../functions/multimaticFn/services/ZoneService';
import { apiGatewayProxyEvent } from '../../__helpers';

jest.mock('../../../functions/multimaticFn/services/AuthenticationService');
jest.mock('../../../functions/multimaticFn/services/FacilityService');
jest.mock('../../../functions/multimaticFn/services/RoomService');
jest.mock('../../../functions/multimaticFn/services/SystemService');
jest.mock('../../../functions/multimaticFn/services/ZoneService');

describe('MultimaticController', () => {
    beforeEach(() => {
        const event = apiGatewayProxyEvent.get({ body: '', headers: {} }) as unknown as LambdaProxyEvent;
        this.request = new Request(event);
        this.controller = new MultimaticController(
            new AuthenticationService(),
            new FacilityService(),
            new RoomService(),
            new SystemService(null),
            new ZoneService(),
        );

        this.controller.authenticationService.parseToken.mockReturnValue('token');
        this.controller.facilityService.getFacilities.mockResolvedValue(['facility1', 'facility2']);
        this.controller.systemService.getSystem.mockResolvedValue('system1');
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    afterAll(() => jest.restoreAllMocks());

    it('retries in case of UnauthorizedError', async () => {
        this.controller.authenticationService.getSessionId.mockRejectedValueOnce(new UnauthorizedError('Oops'));
        this.controller.authenticationService.getSessionId.mockResolvedValueOnce('sessionId');

        const result = await this.controller.getSystems(this.request);

        expect(this.controller.authenticationService.getSessionId).toHaveBeenCalledTimes(2);
        expect(result.statusCode).toEqual(200);
    });

    describe('#getSystem', () => {
        it('fetches a system', async () => {
            this.controller.authenticationService.getSessionId.mockResolvedValue('sessionId');

            const result = await this.controller.getSystems(this.request);

            expect(this.controller.facilityService.getFacilities).toHaveBeenCalledWith('sessionId');
            expect(this.controller.systemService.getSystem).toHaveBeenCalledTimes(2);
            expect(this.controller.systemService.getSystem).toHaveBeenCalledWith('sessionId', 'facility1');
            expect(this.controller.systemService.getSystem).toHaveBeenCalledWith('sessionId', 'facility2');

            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body)).toEqual(['system1', 'system1']);
        });
    });

    describe('#getSystemDetails', () => {
        it('fetches the details of a system', async () => {
            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');
            this.controller.systemService.getSystemStatus.mockResolvedValue('status');

            const result = await this.controller.getSystemDetails(this.request);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual('status');
        });
    });

    describe('#getRoom', () => {
        it('fetches a room', async () => {
            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');
            this.controller.roomService.getRoomDetails.mockResolvedValue('room');

            const result = await this.controller.getRoom(this.request);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual('room');
        });
    });

    describe('#getZone', () => {
        it('fetches a zone', async () => {
            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');
            this.controller.zoneService.getZoneDetails.mockResolvedValue('zone');

            const result = await this.controller.getZone(this.request);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual('zone');
        });
    });

    describe('#setRoomTemperature', () => {
        it('sets the temperature for a room for a given duration', async () => {
            this.request.body = {
                temperature: 20,
                duration: 600,
            };

            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');

            const result = await this.controller.setRoomTemperature(this.request);

            expect(result.statusCode).toEqual(204);
            expect(result.body).toEqual('');
        });

        it('throws a validation error', async () => {
            this.request.body = {};

            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');
            this.controller.zoneService.getZoneList.mockResolvedValue(['zone']);

            await expect(this.controller.setRoomTemperature(this.request)).rejects.toThrow(ValidationError);
        });
    });

    describe('#resetRoomSchedule', () => {
        it('resets a room schedule', async () => {
            this.controller.authenticationService.getSessionId.mockReturnValue('sessionId');

            const result = await this.controller.resetRoomSchedule(this.request);

            expect(result.statusCode).toEqual(204);
            expect(result.body).toEqual('');
        });
    });
});

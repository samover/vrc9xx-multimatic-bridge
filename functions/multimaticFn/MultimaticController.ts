import { BadRequestError, InternalServerError, UnauthorizedError } from 'errors';
import { Delete, Get, Handler, Middleware, Put, Request, Response, ResponseBody, ValidateBody } from 'lambda-core';
import { LOGGER } from 'logger';
import { RoomModel, SystemModel, SystemStatusModel, ZoneModel } from 'models';
import { Authentication, Facility, Room, System, Zone } from 'vaillant-api';
import { FacilityApiModel } from '../../modules/vaillant-api/facility';
import { RoomBuilder } from './builders/RoomBuilder';
import { ZoneBuilder } from './builders/ZoneBuilder';
import { PutRoomTemperatureRequestBody } from './dtos/putRoomTemperatureRequestBody';
import { RoomService } from './services/RoomService';
import { SystemService } from './services/SystemService';
import { VaillantCredentials } from './services/VaillantCredentials';

/** Class representing the controller for the Multimatic Lambda */
export class MultimaticController extends Handler {
    protected middleware: Middleware[] = [];
    private retryCount: number = 0;

    private parseToken(request: Request): string {
        return request.getHeader('authorization').replace(/Bearer /, '');
    }

    private async getSessionId(token: string) {
        const credentials = await VaillantCredentials.get(token);
        return credentials.sessionId;
    }

    private async reAuthenticate(token: string) {
        this.retryCount = this.retryCount + 1;
        if (this.retryCount > 3) {
            throw new UnauthorizedError('Failed to authenticate');
        }

        const credentials = await VaillantCredentials.get(token);
        LOGGER.debug(credentials, 'CREDENTIALS');
        const authentication =  new Authentication(credentials);
        LOGGER.debug(authentication, 'AUTH');
        await authentication.authenticate();
        LOGGER.debug(authentication, 'AUTH');
        await VaillantCredentials.save(token, { ...credentials, sessionId: authentication.getSessionId() });
        return authentication.getSessionId();
    }

    private async getFacilitySerialNumber(sessionId: string): Promise<string> {
        const facilities = new Facility(sessionId);
        const facilitiesList = await facilities.getList();
        return facilitiesList[0].serialNumber;
    }

    private async getFacilities(sessionId: string): Promise<FacilityApiModel[]> {
        const facilities = new Facility(sessionId);
        return facilities.getList();
    }

    @Get('/systems')
    private async getSystems(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /system');
        const token: string = this.parseToken(request);

        try {
            const sessionId: string = await this.getSessionId(token);
            const facilities = await this.getFacilities(sessionId);
            const systems: SystemModel[] = await Promise.all(facilities.map(facility => SystemService.getSystem(sessionId, facility)));
            return Response.ok<SystemModel[]>(request).send(systems);
        } catch (e) {
            LOGGER.error(e, 'Get systems Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ getSystem Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getSystem(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Get('/facilities/{facilityId}/system')
    private async getSystemDetails(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /system');
        const token: string = this.parseToken(request);
        const facilityId: string = request.getPathParam('facilityId') as string;

        try {
            const sessionId: string = await this.getSessionId(token);
            const systemStatus: SystemStatusModel = await SystemService.getSystemStatus(sessionId, facilityId);
            return Response.ok<SystemStatusModel>(request).send(systemStatus);
        } catch (e) {
            LOGGER.error(e, 'Get systemDetails Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ getSystem Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getSystem(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Get('/rooms')
    private async getRooms(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /rooms');
        const token: string = this.parseToken(request);

        try {
            const sessionId: string = await this.getSessionId(token);
            const serialNumber: string = await this.getFacilitySerialNumber(sessionId);
            const rooms = await RoomService.getList(sessionId, serialNumber);

            return Response.ok<RoomModel[]>(request).send(rooms);
        } catch (e) {
            LOGGER.error(e, 'Get Rooms Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ GETROOMS Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getRooms(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Get('/facilities/{facilityId}/rooms/{roomId}')
    private async getRoom(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /room/temperature');

        const token: string = this.parseToken(request);
        const roomId: string = request.getPathParam('roomId') as string;
        const facilityId: string = request.getPathParam('facilityId') as string;

        try {
            const sessionId: string = await this.getSessionId(token);

            // ROOM
            const roomApi = new Room(sessionId, facilityId);
            const room = await roomApi.getDetails(roomId);

            const responseBody: RoomModel = RoomBuilder.build(facilityId, room);
            return Response.ok<RoomModel>(request).send(responseBody);
        } catch (e) {
            LOGGER.error(e, 'Get facility/room Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ GETROOM Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getRoom(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Put('/facilities/{facilityId}/rooms/{roomId}/temperature')
    @ValidateBody(PutRoomTemperatureRequestBody)
    private async setRoomTemperature(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint post /room/temperature');

        const body: PutRoomTemperatureRequestBody = request.getBody<PutRoomTemperatureRequestBody>();
        const token: string = this.parseToken(request);
        const roomId: string = request.getPathParam('roomId') as string;
        const facilityId: string = request.getPathParam('facilityId') as string;

        try {
            const sessionId: string = await this.getSessionId(token);

            // ROOM
            const room = new Room(sessionId, facilityId);
            await room.quickVeto(roomId, body.temperature, body.duration);

            return Response.noContent(request).send();
        } catch (e) {
            LOGGER.error(e, 'Post RoomTemperature Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ PUTROOM Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.setRoomTemperature(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Delete('/facilities/{facilityId}/rooms/{roomId}/temperature')
    private async resetRoomSchedule(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint post /room/temperature');

        const token: string = this.parseToken(request);
        const roomId: string = request.getPathParam('roomId') as string;
        const facilityId: string = request.getPathParam('facilityId') as string;

        try {
            const sessionId: string = await this.getSessionId(token);

            // ROOM
            const room = new Room(sessionId, facilityId);
            await room.deleteQuickVeto(roomId);

            return Response.noContent(request).send();
        } catch (e) {
            LOGGER.error(e, 'Delete RoomTemperature Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ RESETSCHEDULE Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.resetRoomSchedule(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Get('/zones')
    private async getZones(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /zones');
        const token: string = this.parseToken(request);
        // use existing sessionId

        try {
            const sessionId: string = await this.getSessionId(token);
            const serialNumber: string = await this.getFacilitySerialNumber(sessionId);

            // ZONE
            const zoneApi = new Zone(sessionId, serialNumber);
            const zones = await zoneApi.getList();

            const responseBody: ZoneModel[] = zones.map((zone) => ZoneBuilder.build(serialNumber, zone));

            return Response.ok<ZoneModel[]>(request).send(responseBody);
        } catch (e) {
            LOGGER.error(e, 'Get Zones Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ GETZONES Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getRooms(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }

    @Get('/facilities/{facilityId}/zones/{zoneId}')
    private async getZone(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'entrypoint get /zone');

        const token: string = this.parseToken(request);
        const zoneId: string = request.getPathParam('zoneId') as string;
        const facilityId: string = request.getPathParam('facilityId') as string;

        try {
            const sessionId: string = await this.getSessionId(token);

            // ROOM
            const zoneApi = new Zone(sessionId, facilityId);
            const zone = await zoneApi.getDetails(zoneId);

            const responseBody: ZoneModel = ZoneBuilder.build(facilityId, zone);
            return Response.ok<ZoneModel>(request).send(responseBody);
        } catch (e) {
            LOGGER.error(e, 'Get facility/zone Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) {
                LOGGER.debug('@@@@@@@@@@ GETROOM Unauthorized. Try ', this.retryCount);
                await this.reAuthenticate(token);
                return this.getRoom(request);
            }
            else if (e instanceof InternalServerError) { errorMessage = 'Critical service error'; }
            else { errorMessage = 'Invalid Multimatic Credentials'; }

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }
}

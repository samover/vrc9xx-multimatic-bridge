import {
    Delete, Get, Handler, Middleware, Put, Request, Response, ResponseBody, ValidateBody, UseErrorHandler,
} from 'aws-lambda-core';
import {
    RoomModel, SystemModel, SystemStatusModel, ZoneModel,
} from 'models';
import { log } from './decorators/log.decorator';
import { PutRoomTemperatureRequestBody } from './dtos/putRoomTemperatureRequestBody';
import { errorHandler } from './multimaticErrorHandler';
import { AuthenticationService } from './services/AuthenticationService';
import { FacilityService } from './services/FacilityService';
import { RoomService } from './services/RoomService';
import { SystemService } from './services/SystemService';
import { ZoneService } from './services/ZoneService';

/** Class representing the controller for the Multimatic Lambda */
export class MultimaticController extends Handler {
    private authenticationService: AuthenticationService;

    private facilityService: FacilityService;

    private roomService: RoomService;

    private systemService: SystemService;

    private zoneService: ZoneService;

    protected middleware: Middleware[] = [];

    constructor(
        authenticationService: AuthenticationService,
        facilityService: FacilityService,
        roomService: RoomService,
        systemService: SystemService,
        zoneService: ZoneService,
    ) {
        super();
        this.authenticationService = authenticationService;
        this.facilityService = facilityService;
        this.systemService = systemService;
        this.roomService = roomService;
        this.zoneService = zoneService;
    }

    @log
    @Get('/systems')
    @UseErrorHandler(errorHandler)
    public async getSystems(request: Request): Promise<ResponseBody> {
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        const facilities = await this.facilityService.getFacilities(sessionId);
        const systems: SystemModel[] = await Promise.all(
            facilities.map((facility) => this.systemService.getSystem(sessionId, facility)),
        );

        return Response.ok<SystemModel[]>(request).send(systems);
    }

    @log
    @Get('/facilities/{facilityId}/system')
    @UseErrorHandler(errorHandler)
    public async getSystemDetails(request: Request): Promise<ResponseBody> {
        const { facilityId } = request.getPathParams();
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        const systemStatus: SystemStatusModel = await this.systemService.getSystemStatus(sessionId, facilityId);
        return Response.ok<SystemStatusModel>(request).send(systemStatus);
    }

    @log
    @Get('/facilities/{facilityId}/rooms/{roomId}')
    @UseErrorHandler(errorHandler)
    public async getRoom(request: Request): Promise<ResponseBody> {
        const { roomId, facilityId } = request.getPathParams();
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        const room = await this.roomService.getRoomDetails(sessionId, facilityId, roomId);
        return Response.ok<RoomModel>(request).send(room);
    }

    @log
    @Put('/facilities/{facilityId}/rooms/{roomId}/temperature')
    @ValidateBody(PutRoomTemperatureRequestBody)
    @UseErrorHandler(errorHandler)
    public async setRoomTemperature(request: Request): Promise<ResponseBody> {
        const { roomId, facilityId } = request.getPathParams();
        const body: PutRoomTemperatureRequestBody = request.getBody<PutRoomTemperatureRequestBody>();
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        await this.roomService.setRoomTemperature(sessionId, facilityId, roomId, body.temperature, body.duration);
        return Response.noContent(request).send();
    }

    @log
    @Delete('/facilities/{facilityId}/rooms/{roomId}/temperature')
    @UseErrorHandler(errorHandler)
    public async resetRoomSchedule(request: Request): Promise<ResponseBody> {
        const { roomId, facilityId } = request.getPathParams();
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        await this.roomService.resetRoomTemperature(sessionId, facilityId, roomId);
        return Response.noContent(request).send();
    }

    @log
    @Get('/facilities/{facilityId}/zones/{zoneId}')
    @UseErrorHandler(errorHandler)
    public async getZone(request: Request): Promise<ResponseBody> {
        const { zoneId, facilityId } = request.getPathParams();
        const token: string = this.authenticationService.parseToken(request.getHeader('authorization'));

        const sessionId: string = await this.authenticationService.getSessionId(token);
        const zone = await this.zoneService.getZoneDetails(sessionId, facilityId, zoneId);
        return Response.ok<ZoneModel>(request).send(zone);
    }
}

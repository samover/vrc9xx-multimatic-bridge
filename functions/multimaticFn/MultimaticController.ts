import {Handler, Middleware, Post, Request, Response, ResponseBody, ValidateBody} from '../../modules/lambda-core';
import {LOGGER} from '../../modules/logger';
import {encrypt, Token} from "../../modules/security";
import {PostRoomTemperatureRequestBody} from "./dtos/postRoomTemperatureRequestBody";
import {BadRequestError, InternalServerError, UnauthorizedError} from "../../modules/errors";
import {Authentication, Facility, Room} from "../../modules/vaillant-api";
import { Table } from '../../modules/dynamodb/Table';
import uuid from 'uuid/v4';
import * as duration from "duration-fns";

/** Class representing the controller for the Multimatic Lambda */
export class MultimaticController extends Handler {
    protected middleware: Middleware[] = [];

    /*
        Set ROOM to TEMP
            - does room exist?
            - is temperature between accepted ranges?
            - set to default time
        Set ROOM to TEMP for NUM hours
        Turn house on
        Turn house off
        we are at home
        we are away for NUM hours
        we are way till HOUR

        Configuration:
            - group rooms e.g. downstairs
     */
    @Post('/room/temperature')
    /*
        {
            room,
            temperature,
            period,
     */
    @ValidateBody(PostRoomTemperatureRequestBody)
    private async setRoomTemperature(request: Request): Promise<ResponseBody> {
        LOGGER.debug(request, 'Entrypoint POST /room/temperature');

        const body: PostRoomTemperatureRequestBody = request.getBody<PostRoomTemperatureRequestBody>();
        const token: string = request.getHeader('authorization').replace(/Bearer /, '');

        console.log("We found a token", token);

        try {
            const durationInMinutes = duration.toMinutes(duration.parse(body.duration));

            const authentication =  new Authentication(process.env.USERNAME, process.env.PASSWORD, process.env.SMARTPHONE_ID);
            await authentication.authenticate();
            const facilities = new Facility(authentication.sessionId);
            const facilitiesList = await facilities.getList();

            const serialNumber = facilitiesList[0].serialNumber;
            const room = new Room(authentication.sessionId, serialNumber);

            const rooms = await room.getList();
            const desiredRoom = rooms.find(room => room.configuration.name.toLowerCase() === body.room.toLowerCase());

            const result = await room.quickVeto(desiredRoom.roomIndex, parseInt(body.temperature, 10), durationInMinutes);
        } catch (e) {
            LOGGER.error(e, 'ProfileEdit Route failed');
            let errorMessage: string;
            if (e instanceof UnauthorizedError) errorMessage = 'Token invalid or expired';
            else if (e instanceof InternalServerError) errorMessage = 'Critical service error';
            else errorMessage = 'Invalid Multimatic Credentials';

            return Response.fromError(request, new BadRequestError(errorMessage));
        }
    }
}

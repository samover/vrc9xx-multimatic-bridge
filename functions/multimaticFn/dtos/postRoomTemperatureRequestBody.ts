import {IsString, ValidationClass} from "../../../modules/class-validator-wrapper";
import {IsNumber} from "class-validator";

export class PostRoomTemperatureRequestBody extends ValidationClass {
    @IsString()
    room: string;

    @IsNumber()
    temperature: string;

    @IsNumber()
    duration: string;
}

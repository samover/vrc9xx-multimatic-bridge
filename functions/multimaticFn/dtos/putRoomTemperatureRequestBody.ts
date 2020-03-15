import {IsString, ValidationClass} from "class-validator-wrapper";
import {IsNumber} from "class-validator";

export class PutRoomTemperatureRequestBody extends ValidationClass {
    @IsNumber()
    temperature: number;

    @IsNumber()
    duration: number;
}

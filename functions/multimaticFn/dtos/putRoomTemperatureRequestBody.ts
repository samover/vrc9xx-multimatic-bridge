import { IsNumber } from 'class-validator';
import { IsString, ValidationClass } from 'class-validator-wrapper';

export class PutRoomTemperatureRequestBody extends ValidationClass {
    @IsNumber()
    public temperature: number;

    @IsNumber()
    public duration: number;
}

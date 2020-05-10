import { ValidationClass, IsNumber } from 'aws-lambda-core/lib/class-validator-wrapper';

export class PutRoomTemperatureRequestBody extends ValidationClass {
    @IsNumber()
    public temperature: number;

    @IsNumber()
    public duration: number;
}

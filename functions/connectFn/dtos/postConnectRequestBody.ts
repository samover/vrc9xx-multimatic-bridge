import { IsBooleanString } from 'class-validator';
import { IsBoolean, IsString, ValidationClass } from 'class-validator-wrapper';

export class PostConnectRequestBody extends ValidationClass {
    @IsString()
    public username: string;

    @IsString()
    public password: string;

    @IsBooleanString()
    public hasAcceptedTerms: string;
}

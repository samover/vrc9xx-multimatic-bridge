import { IsBooleanString, IsString, ValidationClass } from 'aws-lambda-core/lib/class-validator-wrapper';

export class PostConnectRequestBody extends ValidationClass {
    @IsString()
    public username: string;

    @IsString()
    public password: string;

    @IsBooleanString()
    public hasAcceptedTerms: string;
}

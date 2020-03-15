import { ValidationClass, IsBoolean, IsString } from "class-validator-wrapper";
import {IsBooleanString} from "class-validator";

export class PostConnectRequestBody extends ValidationClass {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsBooleanString()
    hasAcceptedTerms: string;
}

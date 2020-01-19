import { IdTokenClaims } from 'openid-client';

export interface MiaaClaims extends IdTokenClaims {
    codsid: string;
    validated_user: string;
}

import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { LOGGER } from 'logger';
import { Token, UserInfo } from 'security';

export interface CognitoAuthorizerEvent {
    authorizationToken: string;
    methodArn: string;
}

export interface Policy {
    principalId: string;
    policyDocument: {
        Version: string;
        Statement: Array<{ Action: string; Effect: string; Resource: string }>;
    };
}

export interface JwtPayload {
    sub: string;
}

export class CognitoAuthorizerHandler {
    private issuer: string;

    constructor(issuer: string) {
        this.issuer = issuer;
    }

    private static parseAuthorizationToken(token: string): string {
        if (!token) {
            throw new UnauthorizedError('Unauthorized');
        }

        return token.substring(7);
    }

    private static buildAllowedResourceArn(methodArn: string): string {
        return `${methodArn.split('/')[0]}/*/*`;
    }

    // Generate policy to allow this user on this API:
    private static generatePolicy(principalId: string, resourceArn: string): Policy {
        return {
            principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: resourceArn,
                }],
            },
        };
    }

    private static async getPemFromIssuer(issuer: string): Promise<string> {
        const response = await axios.get(`${issuer}.well-known/jwks.json`);
        const keys = response.data;

        // Based on the JSON of `jwks` create a Pem:
        const k = keys.keys[0];
        const jwkArray = { kty: k.kty, n: k.n, e: k.e };
        return jwkToPem(jwkArray);
    }


    // Reusable Authorizer function, set on `authorizer` field in serverless.yml
    public async handle(event: CognitoAuthorizerEvent): Promise<Policy> {
        LOGGER.info(JSON.stringify(event, null, 2), 'Auth function invoked');

        try {
            // Remove 'bearer ' from token:
            const token = CognitoAuthorizerHandler.parseAuthorizationToken(event.authorizationToken);

            // Make a request to the iss + .well-known/jwks.json URL:
            const pem = await CognitoAuthorizerHandler.getPemFromIssuer(this.issuer);

            const userInfo: UserInfo = await Token.verify(token, pem, { issuer: this.issuer });
            return CognitoAuthorizerHandler.generatePolicy(
                userInfo.sub,
                CognitoAuthorizerHandler.buildAllowedResourceArn(event.methodArn),
            );
        } catch (e) {
            LOGGER.error(e, 'Unauthorized');
            throw new UnauthorizedError('Unauthorized');
        }
    }
}

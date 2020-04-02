import axios from 'axios';
import { UnauthorizedError } from 'errors';
import { verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { LOGGER } from 'logger';

// TODO: place in configuration
const iss = 'https://samover.eu.auth0.com/';

interface Policy {
    principalId: string;
    policyDocument: {
        Version: string;
        Statement: Array<{ Action: string; Effect: string; Resource: string }>;
    };
}

// Generate policy to allow this user on this API:
const generatePolicy = (principalId: string, effect: string, resourceArn: string): Policy => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resourceArn,
            }],
        }
    };
};

interface CognitoAuthorizerEvent {
    authorizationToken: string;
    methodArn: string;
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const handler = async (event: CognitoAuthorizerEvent) => {
    LOGGER.info(JSON.stringify(event, null, 2), 'Auth function invoked');

    if (!event.authorizationToken) {
        throw new UnauthorizedError('Unauthorized');
    }

    try {
        // Remove 'bearer ' from token:
        const token = event.authorizationToken.substring(7);

        // Make a request to the iss + .well-known/jwks.json URL:
        const response = await axios.get(`${iss}.well-known/jwks.json`);
        const keys = response.data;

        // Based on the JSON of `jwks` create a Pem:
        const k = keys.keys[0];
        const jwkArray = { kty: k.kty, n: k.n, e: k.e };
        const pem = jwkToPem(jwkArray);

        // Verify the token:
        return new Promise((resolve, reject) => {
            verify(token, pem, { issuer: iss }, (err: Error, decoded: any) => {
                if (err) { return reject(err); }
                return resolve(generatePolicy(decoded.sub, 'Allow', event.methodArn));
            });
        });
    } catch (e) {
        LOGGER.error(e, 'Unauthorized');
        throw new UnauthorizedError('Unauthorized');
    }
};

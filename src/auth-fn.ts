import { verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

const iss = 'https://samover.eu.auth0.com/';

interface Policy {
    principalId: string;
    policyDocument: {
        Version: String;
        Statement: { Action: string; Effect: string; Resource: string }[];
    }
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
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const handler = async (event: CognitoAuthorizerEvent) => {
  console.log('Auth function invoked');
  if (event.authorizationToken) {
    // Remove 'bearer ' from token:
    const token = event.authorizationToken.substring(7);
    // Make a request to the iss + .well-known/jwks.json URL:
    request(
      { url: `${iss}/.well-known/jwks.json`, json: true },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log('Request error:', error);
          cb('Unauthorized');
        }
        const keys = body;
        // Based on the JSON of `jwks` create a Pem:
        const k = keys.keys[0];
        const jwkArray = {
          kty: k.kty,
          n: k.n,
          e: k.e,
        };
        const pem = jwkToPem(jwkArray);

        // Verify the token:
        jwk.verify(token, pem, { issuer: iss }, (err, decoded) => {
          if (err) {
            console.log('Unauthorized user:', err.message);
            cb('Unauthorized');
          } else {
            cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
          }
        });
      });
  } else {
    console.log('No authorizationToken found in the header.');
    cb('Unauthorized');
  }
};

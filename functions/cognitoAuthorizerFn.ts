import { CognitoAuthorizerHandler } from './cognitoAuthorizeFn/CognitoAuthorizerHandler';

const iss = process.env.ISSUER;
const entryPoint = new CognitoAuthorizerHandler(iss);

export const handler = entryPoint.handle.bind(entryPoint);

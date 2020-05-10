import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
import axios from 'axios';
import * as faker from 'faker';
import jwkToPem from 'jwk-to-pem';
import * as securityMock from '../../__mocks/securityMock';
import {
    CognitoAuthorizerEvent,
    CognitoAuthorizerHandler,
    Policy
} from '../../../functions/cognitoAuthorizeFn/CognitoAuthorizerHandler';

jest.mock('axios');
jest.mock('jwk-to-pem');

const issuer = faker.internet.url();
const authorizerEvent: CognitoAuthorizerEvent = { authorizationToken: 'token', methodArn: 'arn' };
const policy: Policy = {
    principalId: faker.random.uuid(),
    policyDocument: {
        Version: faker.random.word(),
        Statement: [{
            Action: faker.lorem.word(),
            Effect: faker.lorem.word(),
            Resource: faker.lorem.word(),
        }],
    },
};

describe('CognitoAuthorizerFn', () => {
    beforeEach(() => {
        securityMock.init();
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#handler', () => {
        afterAll(() => jest.restoreAllMocks());

        it('validates token and returns a policy', async () => {
            // @ts-ignore
            jest.spyOn(CognitoAuthorizerHandler, 'getPemFromIssuer').mockImplementation(async () => 'pem');
            // @ts-ignore
            jest.spyOn(CognitoAuthorizerHandler, 'parseAuthorizationToken').mockImplementation(() => 'token');
            // @ts-ignore
            jest.spyOn(CognitoAuthorizerHandler, 'generatePolicy').mockImplementation(() => policy);

            const handler = new CognitoAuthorizerHandler(issuer);

            const result = await handler.handle(authorizerEvent);
            expect(result).toEqual(policy);

            expect(securityMock.verifyStub).toHaveBeenCalledWith('token', 'pem', { issuer });
            // @ts-ignore
            expect(CognitoAuthorizerHandler.getPemFromIssuer).toHaveBeenCalledWith(issuer);
            // @ts-ignore
            expect(CognitoAuthorizerHandler.parseAuthorizationToken).toHaveBeenCalledWith(authorizerEvent.authorizationToken);
            // @ts-ignore
            expect(CognitoAuthorizerHandler.generatePolicy).toHaveBeenCalledWith(securityMock.username, authorizerEvent.methodArn);
        });

        it('throws an unauthorized error', async () => {
            // @ts-ignore
            jest.spyOn(CognitoAuthorizerHandler, 'getPemFromIssuer').mockRejectedValue(new Error());
            // @ts-ignore
            jest.spyOn(CognitoAuthorizerHandler, 'parseAuthorizationToken').mockImplementation(() => 'mockToken');

            const handler = new CognitoAuthorizerHandler(issuer);

            await expect(handler.handle(authorizerEvent)).rejects.toThrow(UnauthorizedError);

            // @ts-ignore
            expect(CognitoAuthorizerHandler.getPemFromIssuer).toHaveBeenCalledWith(issuer);
            // @ts-ignore
            expect(CognitoAuthorizerHandler.parseAuthorizationToken).toHaveBeenCalledWith(authorizerEvent.authorizationToken);
        });
    });

    describe('#parseAuthorizationToken', () => {
        it('parses the token from authorization token', () => {
            const authToken = 'Bearer token';
            // @ts-ignore
            expect(CognitoAuthorizerHandler.parseAuthorizationToken(authToken)).toEqual('token');
        });

        it('throws an unauthorized error when token is missing', () => {
            // @ts-ignore
            expect(() => CognitoAuthorizerHandler.parseAuthorizationToken(null)).toThrow(UnauthorizedError);
        });
    });

    describe('#generatePolicy', () => {
        it('returns an aws policy', () => {
            const principalId = faker.random.uuid();
            const resourceArn = faker.random.uuid();

            // @ts-ignore
            const policy: Policy = CognitoAuthorizerHandler.generatePolicy(principalId, resourceArn);

            expect(policy.principalId).toEqual(principalId);
            expect(policy.policyDocument.Statement[0].Action).toEqual('execute-api:Invoke');
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Allow');
            expect(policy.policyDocument.Statement[0].Resource).toEqual(resourceArn);
        });
    });

    describe('#getPemFromIssuer', () => {
        it('fetches jwks keys and generates pem', async () => {
            const jwkArray = { kty: 'kty', n: 'n', e: 'e' };
            // @ts-ignore
            axios.get.mockResolvedValue({
                data: {
                    keys: [jwkArray],
                },
            });

            // @ts-ignore
            jwkToPem.mockReturnValue('pem');
            // @ts-ignore
            await expect(CognitoAuthorizerHandler.getPemFromIssuer(issuer)).resolves.toEqual('pem');
            expect(jwkToPem).toHaveBeenCalledWith(jwkArray);
        });
    })
});

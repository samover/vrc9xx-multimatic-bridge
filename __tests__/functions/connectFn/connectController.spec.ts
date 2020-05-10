/* tslint:disable:ordered-imports */
import { UnauthorizedError } from 'aws-lambda-core/lib/errors';
// MOCKS AND HELPERS
import { apiGatewayProxyEvent } from '../../__helpers';
import * as tableMock from '../../__mocks/dynamodbMock';
import * as vaillantApiMock from '../../__mocks/vaillantApiMock';
import * as securityMock from '../../__mocks/securityMock';

// MODULES
import { Handler, LambdaProxyEvent, Request } from 'aws-lambda-core';
import { ConnectController } from '../../../functions/connectFn/ConnectController';
import { PostConnectRequestBody } from '../../../functions/connectFn/dtos/postConnectRequestBody';
import { CredentialsService } from '../../../functions/connectFn/services/credentialsService';

describe('ConnectController', () => {
    let saveCredentialsMock: jest.Mock;
    let verifyCredentialsMock: jest.Mock;

    const buildRequest = (): Request => {
        const requestBody = { hasAcceptedTerms: 'true', password: 'password', username: 'username' };
        const requestHeaders = { authorization: ['Bearer valid_token'] };

        const event = apiGatewayProxyEvent.get({ body: JSON.stringify(requestBody), headers: requestHeaders }) as unknown as LambdaProxyEvent;

        return new Request(event);
    };

    beforeAll(() => {
        saveCredentialsMock = jest.fn();
        verifyCredentialsMock = jest.fn();
    });
    beforeEach(() => {
        vaillantApiMock.init();
        tableMock.init();
        securityMock.init();
        CredentialsService.save = saveCredentialsMock;
        CredentialsService.verify = verifyCredentialsMock.mockResolvedValue('authentication');
    });
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('extends Handler', () => {
        expect(new ConnectController()).toBeInstanceOf(Handler);
    });

    describe('POST /connect', () => {
        it('returns 400 when token is invalid', async () => {
            securityMock.verifyStub.mockRejectedValueOnce(new UnauthorizedError('Invalid token'));
            const controller = new ConnectController();

            // @ts-ignore
            const response = await controller.postConnect(buildRequest());
            expect(response.statusCode).toEqual(400);
            expect(response.body).toMatch('Token invalid or expired');
        });
        it('returns 400 when user has not accepted terms', async () => {
            const controller = new ConnectController();
            const request = buildRequest();
            // @ts-ignore
            request.body.hasAcceptedTerms = 'false';

            // @ts-ignore
            const response = await controller.postConnect(request);
            expect(response.statusCode).toEqual(400);
            expect(response.body).toMatch('User must accept Terms and Conditions');
        });
        it('returns 204 after saving correct credentials in table', async () => {
            const controller = new ConnectController();
            const request = buildRequest();

            // @ts-ignore
            const response = await controller.postConnect(request);
            expect(response.body).toEqual('');
            expect(response.statusCode).toEqual(204);
        });

        it('verifies the vaillant credentials', async () => {
            const controller = new ConnectController();
            const request = buildRequest();

            // @ts-ignore
            await controller.postConnect(request);

            expect(securityMock.verifyStub).toHaveBeenCalledTimes(1);
            expect(verifyCredentialsMock).toHaveBeenCalledTimes(1);
            expect(verifyCredentialsMock).toHaveBeenCalledWith(
                request.getBody<PostConnectRequestBody>().username,
                request.getBody<PostConnectRequestBody>().password,
                expect.anything(),
            );
        });
        it('saves the vaillant credentials and user t&c acceptance', async () => {
            const controller = new ConnectController();
            const request = buildRequest();

            // @ts-ignore
            await controller.postConnect(request);

            expect(saveCredentialsMock).toHaveBeenCalledTimes(1);
            expect(saveCredentialsMock).toHaveBeenCalledWith(
                'authentication',
                securityMock.username,
                request.getBody<PostConnectRequestBody>().hasAcceptedTerms,
            );
        });
    });
});

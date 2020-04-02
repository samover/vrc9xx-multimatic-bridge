/* tslint:disable:ordered-imports */
// MOCKS AND HELPERS
import { apiGatewayProxyEvent } from '../__helpers';
import * as tableMock from '../__mocks/dynamodbMock';
import * as vaillantApiMock from '../__mocks/vaillantApiMock';
import * as securityMock from '../__mocks/securityMock';

// MODULES
import { UnauthorizedError } from 'errors';
import { Handler, LambdaProxyEvent, Request } from 'lambda-core';
import { ConnectController } from '../../functions/connectFn/ConnectController';
import { PostConnectRequestBody } from '../../functions/connectFn/dtos/postConnectRequestBody';

describe('ConnectController', () => {
    const buildRequest = (): Request => {
        const requestBody = { hasAcceptedTerms: 'true', password: 'password', username: 'username' };
        const requestHeaders = { authorization: ['Bearer valid_token'] };

        const event = apiGatewayProxyEvent.get({ body: JSON.stringify(requestBody), headers: requestHeaders }) as unknown as LambdaProxyEvent;

        event.resource = '/connect';
        event.httpMethod = 'POST';

        return new Request(event);
    };

    beforeEach(() => {
        vaillantApiMock.init();
        tableMock.init();
        securityMock.init();
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

            // assert mocks
            expect(securityMock.verifyStub).toHaveBeenCalledTimes(1);
            expect(securityMock.encryptStub).toHaveBeenCalledTimes(1);
            expect(vaillantApiMock.loginStub).toHaveBeenCalledTimes(1);
            expect(vaillantApiMock.authenticateStub).toHaveBeenCalledTimes(1);
            expect(tableMock.putItemStub).toHaveBeenCalledTimes(1);

            expect(JSON.parse(securityMock.encryptStub.mock.calls[0][0])).toMatchObject({
                authToken: vaillantApiMock.authToken,
                sessionId: vaillantApiMock.sessionId,
                smartphoneId: expect.anything(),
                username: request.getBody<PostConnectRequestBody>().username,
            });
            expect(tableMock.putItemStub).toHaveBeenCalledWith({
                userId: securityMock.username,
                hasAcceptedTerms: request.getBody<PostConnectRequestBody>().hasAcceptedTerms,
                secret: JSON.stringify({ encryptedData: securityMock.encryptedValue }),
            })
        });
    });
});

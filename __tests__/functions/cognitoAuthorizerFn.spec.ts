import { CognitoAuthorizerHandler } from '../../functions/cognitoAuthorizeFn/CognitoAuthorizerHandler';

jest.mock('../../functions/cognitoAuthorizeFn/CognitoAuthorizerHandler');

const bindStub = jest.fn();
const mockImplementation = { handle: { bind: bindStub } };
(CognitoAuthorizerHandler as any).mockImplementation(() => mockImplementation);

describe('CognitoAuthorizerFn', () => {
    let handler: any;

    beforeAll(() => {
        bindStub.mockReturnValue('handle');
        handler = require('../../functions/cognitoAuthorizerFn').handler;
    });

    it('instantiates the CognitoAuthorizerHandler with the issuer url', () => {
        expect(CognitoAuthorizerHandler).toHaveBeenCalledWith(process.env.ISSUER);
    });
    it('binds the handle method', () => {
        expect(bindStub).toHaveBeenCalledWith(mockImplementation);
    });
    it('exposes the handle method', () => {
        expect(handler).toEqual('handle');
    });
});

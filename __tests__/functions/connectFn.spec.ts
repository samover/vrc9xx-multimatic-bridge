import { ConnectEntryPoint } from '../../functions/connectFn/ConnectEntryPoint';

jest.mock('../../functions/connectFn/ConnectEntryPoint');

const bindStub = jest.fn();
const mockImplementation = { handle: { bind: bindStub } };
(ConnectEntryPoint as any).mockImplementation(() => mockImplementation);

describe('ConnectFn', () => {
    let handler: any;

    beforeAll(() => {
        bindStub.mockReturnValue('handle');
        handler = require('../../functions/connectFn').handler;
    });

    it('instantiates the ConnectEntryPoint', () => {
        expect(ConnectEntryPoint).toHaveBeenCalled();
    });
    it('binds the handle method', () => {
        expect(bindStub).toHaveBeenCalledWith(mockImplementation);
    });
    it('exposes the handle method', () => {
        expect(handler).toEqual('handle');
    });
});

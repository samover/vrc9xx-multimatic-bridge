import { MultimaticEntryPoint } from '../../functions/multimaticFn/MultimaticEntryPoint';

jest.mock('../../functions/multimaticFn/MultimaticEntryPoint');

const bindStub = jest.fn();
const mockImplementation = { handle: { bind: bindStub } };
(MultimaticEntryPoint as any).mockImplementation(() => mockImplementation);

describe('MultimaticFn', () => {
    let handler: any;

    beforeAll(() => {
        bindStub.mockReturnValue('handle');
        handler = require('../../functions/multimaticFn').handler;
    });

    it('instantiates the MultimaticEntryPoint', () => {
        expect(MultimaticEntryPoint).toHaveBeenCalled();
    });
    it('binds the handle method', () => {
        expect(bindStub).toHaveBeenCalledWith(mockImplementation);
    });
    it('exposes the handle method', () => {
        expect(handler).toEqual('handle');
    });
});

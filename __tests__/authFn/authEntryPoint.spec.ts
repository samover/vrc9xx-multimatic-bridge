import { AuthController } from '../../src/src/AuthController';
import { AuthEntryPoint } from '../../src/src/AuthEntryPoint';

describe('AuthEntryPoint', () => {
    describe('#initializeHander', () => {
        it('returns an instance of the handler', async () => {
            const entryPoint = new AuthEntryPoint();
            expect(await entryPoint.initializeHandler()).toBeInstanceOf(AuthController);
        });
    });
});

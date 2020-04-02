import { LambdaEntryPoint } from 'lambda-core';
import { ConnectController } from '../../functions/connectFn/ConnectController';
import { ConnectEntryPoint } from '../../functions/connectFn/ConnectEntryPoint';

describe('ConnectEntryPoint', () => {
    it('extends LambdaEntryPoint', async () => {
        const entryPoint = new ConnectEntryPoint();
        expect(entryPoint).toBeInstanceOf(LambdaEntryPoint);
    });

    it('#initializeHandler returns instance of ConnectController', async () => {
        const entryPoint = new ConnectEntryPoint();
        await expect(entryPoint.initializeHandler()).resolves.toBeInstanceOf(ConnectController);
    })
});

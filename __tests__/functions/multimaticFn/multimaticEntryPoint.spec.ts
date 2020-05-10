import { LambdaEntryPoint } from 'aws-lambda-core';
import { MultimaticController } from '../../../functions/multimaticFn/MultimaticController';
import { MultimaticEntryPoint } from '../../../functions/multimaticFn/MultimaticEntryPoint';

describe('MultimaticEntryPoint', () => {
    it('extends LambdaEntryPoint', async () => {
        const entryPoint = new MultimaticEntryPoint();
        expect(entryPoint).toBeInstanceOf(LambdaEntryPoint);
    });

    it('#initializeHandler returns instance of MultimaticController', async () => {
        const entryPoint = new MultimaticEntryPoint();
        await expect(entryPoint.initializeHandler()).resolves.toBeInstanceOf(MultimaticController);
    })
});

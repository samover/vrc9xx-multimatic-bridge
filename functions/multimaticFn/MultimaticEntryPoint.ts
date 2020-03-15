import { LambdaEntryPoint } from 'lambda-core';
import { LOGGER } from 'logger';
import { MultimaticController } from './MultimaticController';

/** Lambda Entrypoint for Authentication lambda */
export class MultimaticEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<MultimaticController> {
        LOGGER.debug('Initializing Multimatic LambdaHandler');
        return new MultimaticController();
    }
}

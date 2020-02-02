import { LambdaEntryPoint } from '../../modules/lambda-core';
import { LOGGER } from '../../modules/logger';
import { MultimaticController } from './MultimaticController';

/** Lambda Entrypoint for Authentication lambda */
export class MultimaticEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<MultimaticController> {
        LOGGER.debug('Initializing Profile LambdaHandler');
        return new MultimaticController();
    }
}

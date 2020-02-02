import { LambdaEntryPoint } from '../../modules/lambda-core';
import { LOGGER } from '../../modules/logger';
import { ConnectController } from './ConnectController';

/** Lambda Entrypoint for Authentication lambda */
export class ConnectEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<ConnectController> {
        LOGGER.debug('Initializing Profile LambdaHandler');
        return new ConnectController();
    }
}

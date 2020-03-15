import { LambdaEntryPoint } from 'lambda-core';
import { LOGGER } from 'logger';
import { ConnectController } from './ConnectController';

/** Lambda Entrypoint for Authentication lambda */
export class ConnectEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<ConnectController> {
        LOGGER.debug('Initializing Connect LambdaHandler');
        return new ConnectController();
    }
}

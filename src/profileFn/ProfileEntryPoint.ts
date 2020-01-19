import { LambdaEntryPoint } from 'lambda-core';
import { LOGGER } from 'logger';
import { ProfileController } from './ProfileController';

/** Lambda Entrypoint for Authentication lambda */
export class ProfileEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<ProfileController> {
        LOGGER.debug('Initializing Profile LambdaHandler');
        return new ProfileController();
    }
}

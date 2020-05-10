import { LambdaEntryPoint } from 'aws-lambda-core';
import { LOGGER } from 'logger';
import { MultimaticController } from './MultimaticController';
import { AuthenticationService } from './services/AuthenticationService';
import { FacilityService } from './services/FacilityService';
import { RoomService } from './services/RoomService';
import { SystemService } from './services/SystemService';
import { ZoneService } from './services/ZoneService';

/** Lambda Entrypoint for Authentication lambda */
export class MultimaticEntryPoint extends LambdaEntryPoint {
    public async initializeHandler(): Promise<MultimaticController> {
        LOGGER.debug('Initializing Multimatic LambdaHandler');

        const authenticationService = new AuthenticationService();
        const roomService = new RoomService();
        const zoneService = new ZoneService();
        const facilityService = new FacilityService();
        const systemService = new SystemService(roomService);

        return new MultimaticController(
            authenticationService, facilityService, roomService, systemService, zoneService,
        );
    }
}

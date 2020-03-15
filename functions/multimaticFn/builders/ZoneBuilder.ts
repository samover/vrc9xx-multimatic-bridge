import { ZoneModel } from 'models';
import { ZoneApiModel } from 'vaillant-api';

export class ZoneBuilder {
    public static build(serialNumber: string, zone: ZoneApiModel): ZoneModel {
        return {
            id: zone._id,
            facilityId: serialNumber,
            enabled: zone.configuration.enabled,
            name: zone.configuration.name.trim().toLowerCase(),
            mode: zone.heating.configuration.mode,
            insideTemperature: zone.configuration.inside_temperature,
        }
    }
}

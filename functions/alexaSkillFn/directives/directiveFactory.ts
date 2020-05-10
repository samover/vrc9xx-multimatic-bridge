import { NAMESPACES } from '../common/constants/alexaEvent.constants';
import { AlexaDiscoveryDirective } from './AlexaDiscoveryDirective';
import { AlexaThermostatControlDirective } from './AlexaThermostatControlDirective';
import { AlexaDirective } from './AlexaDirective';
import { AbstractDirective } from './AbstractDirective';
import { AlexaEvent } from '../common/interfaces/alexaEvent.interface';

export const directiveFactory = {
    create: (event: AlexaEvent): AbstractDirective => {
        const { namespace } = event.header;

        switch (namespace) {
            case NAMESPACES.Alexa:
                return new AlexaDirective(event);

            case NAMESPACES.AlexaDiscovery:
                return new AlexaDiscoveryDirective(event);

            case NAMESPACES.AlexaThermostatController:
                return new AlexaThermostatControlDirective(event);

            default:
                return new AlexaDirective(event);
        }
    },
};

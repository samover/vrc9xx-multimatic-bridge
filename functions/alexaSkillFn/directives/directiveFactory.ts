import {NAMESPACES} from "../common/constants/alexaEvent.constants";
import {AlexaDiscoveryDirective} from "./AlexaDiscoveryDirective";
import {AlexaThermostatControlDirective} from "./AlexaThermostatControlDirective";
import {AlexaDirective} from "./AlexaDirective";
import {AbstractDirective} from "./AbstractDirective";
import {AlexaEvent} from "../common/interfaces/alexaEvent.interface";

export const directiveFactory = {
    create: (event: AlexaEvent): AbstractDirective => {
        const namespace = event.header.namespace;

        switch (namespace) {
            case NAMESPACES.Alexa:
                return new AlexaDirective(event);
                break;

            case NAMESPACES.AlexaDiscovery:
                return new AlexaDiscoveryDirective(event);
                break;

            case NAMESPACES.AlexaThermostatController:
                return new AlexaThermostatControlDirective(event);
                break;

            default:
                // log('Error', 'Unsupported namespace: ' + requestedNamespace);
                // response = handleUnexpectedInfo(requestedNamespace);
                return new AlexaDirective(event);
                break;

        }// switch
    }
};

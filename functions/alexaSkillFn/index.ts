import { LOGGER } from 'logger';
import { AlexaContext } from './common/interfaces/alexaContext.interface';
import { AlexaRequestDirective, AlexaResponseEvent } from './common/interfaces/alexaEvent.interface';
import { directiveFactory } from './directives/directiveFactory';

export const handler = async (event: AlexaRequestDirective, context: AlexaContext): Promise<AlexaResponseEvent> => {
    LOGGER.debug(event, '*** Received Directive');
    LOGGER.debug(context, '*** Received Context');

    const directive = directiveFactory.create(event.directive);
    const response = await directive.handle();
    LOGGER.debug(response, '*** Alexa response');

    return response;
};

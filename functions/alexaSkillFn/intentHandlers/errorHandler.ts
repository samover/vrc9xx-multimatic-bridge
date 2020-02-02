import { HandlerInput } from "ask-sdk-core";

export const ErrorHandler = {
    canHandle(handlerInput: HandlerInput, error: Error) {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};


import {HandlerInput} from "ask-sdk-core";

export const HomeScheduleIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HomeScheduleIntent';
    },
    handle(handlerInput: HandlerInput) {
        console.log('HomeScheduleIntentHandler', JSON.stringify(handlerInput, null, 2));
        const speechText = 'I set the thermostat to Home. Enjoy!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

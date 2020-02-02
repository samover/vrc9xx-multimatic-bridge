import * as duration from 'duration-fns'
import {HandlerInput} from "ask-sdk-core";
import {RoomTemperature} from "../multimatic-api";

export const SetRoomTemperatureIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetRoomTemperatureIntent';
    },
    async handle(handlerInput: HandlerInput) {
        console.log("@@@@@@@@@@@@@@@@ input", handlerInput);
        const token = handlerInput.requestEnvelope.context.System.applicationToken;

        const intentSlots = handlerInput.requestEnvelope.request.intent.slots;

        const desiredRoom = intentSlots.room && intentSlots.room.value && intentSlots.room.value.toLowerCase();
        const temperature = intentSlots.temperature && intentSlots.temperature.value && parseInt(intentSlots.temperature.value, 10);
        const isoDuration = intentSlots.duration && intentSlots.duration.value;
        const durationInMinutes = duration.toMinutes(duration.parse(isoDuration));

        const roomTemperature = new RoomTemperature(token);
        await roomTemperature.set(desiredRoom, temperature, durationInMinutes);

        const speechText = `The temperature in the ${desiredRoom} is now set to ${temperature} degrees for the duration of ${durationInMinutes} minutes`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};


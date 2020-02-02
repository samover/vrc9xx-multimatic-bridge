import { SkillBuilders } from 'ask-sdk-core';
import {HelpIntentHandler} from "./intentHandlers/helpIntentHandler";
import {SetRoomTemperatureIntentHandler} from "./intentHandlers/setRoomTemperatureIntentHandler";
import {HomeScheduleIntentHandler} from "./intentHandlers/homeScheduleIntentHandler";
import {CancelAndStopIntentHandler} from "./intentHandlers/cancelAndStopIntentHandler";
import {LaunchRequestHandler} from "./intentHandlers/launchRequestHandler";
import {SessionEndedRequestHandler} from "./intentHandlers/sessionEndedRequestHandler";
import {ErrorHandler} from "./intentHandlers/errorHandler";

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,

        // custom intents
        HomeScheduleIntentHandler,
        SetRoomTemperatureIntentHandler,
        )
    .addErrorHandlers(ErrorHandler)
    .lambda();

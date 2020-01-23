import {LOGGER} from "../logger";
import {AxiosError} from "axios";

export const errorHandler = (error: AxiosError, errorMessage?: string) => {
    LOGGER.debug(error.config, 'APIGEE :: ERROR :: RequestConfig');
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        LOGGER.debug(error.response, `APIGEE :: ERROR :: Server responded with errorCode ${error.response.status}`)
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        LOGGER.debug(error.request, 'APIGEE :: ERROR :: Server did not send a response');
    } else {
        // Something happened in setting up the request that triggered an Error
        LOGGER.debug(error.message, 'APIGEE :: ERROR :: Request not correctly set up');
    }

    throw new Error(errorMessage);
};

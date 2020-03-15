import {LOGGER} from "../logger";
import {AxiosError} from "axios";
import {UnauthorizedError} from "errors";

export const errorHandler = (error: AxiosError, errorMessage?: string) => {
    LOGGER.debug(error.config, 'VAILLANT-API :: ERROR :: RequestConfig');
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        LOGGER.debug(error.response, `VAILLANT-API :: ERROR :: Server responded with errorCode ${error.response.status}`);
        if (error.response.status === 401) {
            throw new UnauthorizedError(JSON.stringify(error.response.data));
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        LOGGER.debug(error.request, 'VAILLANT-API :: ERROR :: Server did not send a response');
    } else {
        // Something happened in setting up the request that triggered an Error
        LOGGER.debug(error.message, 'VAILLANT-API :: ERROR :: Request not correctly set up');
    }

    throw new Error(errorMessage);
};

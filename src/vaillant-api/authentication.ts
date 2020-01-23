import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {LOGGER} from "../logger";
import {errorHandler} from "./error-handler";

const baseUrl = 'https://smart.vaillant.com/mobile/api/v4';

export const login = async (username: string, password: string, smartphoneId: string): Promise<void> => {
    const path = '/account/authentication/v1/token/new';
    try {
        const requestConfig: AxiosRequestConfig = {
            baseURL: baseUrl,
            data: { username, password, smartphoneId },
            method: 'POST',
            url: path,
        };

        return axios.request(requestConfig);
    } catch (e) {
        errorHandler(e);
    }
};

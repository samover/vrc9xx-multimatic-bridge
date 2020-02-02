import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {errorHandler} from "./errorHandler";
import { ApiPath } from "./ApiPath";
import * as cookie from 'cookie';
import {VaillantApiResponse} from "./common/interfaces/vaillantApiResponse.interface";

export interface AuthToken {
    authToken: string;
}

export interface SessionId {
    sessionId: string;
}


export class Authentication {
    private username: string;
    private password: string;
    private smartphoneId: string;
    private authToken: string;
    public sessionId: string;

    constructor(username: string, password: string, smartphoneId: string) {
        this.username = username;
        this.password = password;
        this.smartphoneId = smartphoneId;
    }

    private login = async (): Promise<void> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.newToken(),
                data: { username: this.username, password: this.password, smartphoneId: this.smartphoneId },
                method: 'POST',
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            this.authToken = response.data && response.data.body && response.data.body.authToken;
        } catch (e) {
            errorHandler(e);
        }
    };

    public authenticate = async (): Promise<void> => {
        try {
            if (!this.authToken) await this.login();
            if (this.sessionId) return null;

            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.authenticate(),
                data: { username: this.username, authToken: this.authToken, smartphoneId: this.smartphoneId },
                method: 'POST',
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            const cookies: any = cookie.parse(response.headers['set-cookie'].join(';'));
            this.sessionId = cookies.JSESSIONID;
        } catch (e) {
            errorHandler(e);
        }
    }
}

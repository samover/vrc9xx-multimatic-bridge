import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {errorHandler} from "./errorHandler";
import { ApiPath } from "./ApiPath";
import * as cookie from 'cookie';
import {VaillantApiResponse} from "./common/interfaces/vaillantApiResponse.interface";
import {Credentials} from "./common/interfaces/vaillantCredentials.interface";

export interface AuthToken {
    authToken: string;
}

export interface SessionId {
    sessionId: string;
}


export class Authentication {
    private username: string;
    private smartphoneId: string;
    private authToken: string;
    private sessionId: string;

    constructor(credentials: Credentials) {
        this.username = credentials.username;
        this.smartphoneId = credentials.smartphoneId;
        this.authToken = credentials.authToken;
        this.sessionId = credentials.sessionId;
    }

    public login = async (password: string): Promise<void> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.newToken(),
                data: { username: this.username, password, smartphoneId: this.smartphoneId },
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
            // use sessionId
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
    };

    public getAuthToken(): string {
        return this.authToken;
    }

    public getSessionId(): string {
        return this.sessionId;
    }
}

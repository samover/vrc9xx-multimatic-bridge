import {errorHandler} from "./errorHandler";
import axios, {AxiosRequestConfig} from "axios";

const BASE_PATH = 'https://z55al0vgn1.execute-api.eu-west-1.amazonaws.com/dev';

export class RoomTemperature {
    private path: string = '/room/temperature';
    private authToken: string;

    constructor(authToken: string) {
        this.authToken = authToken;
    }

    public async get() {}

    public async set(room: string, temperature: number, duration: number): Promise<void> {
        try {
            const requestConfig: AxiosRequestConfig = {
                baseURL: process.env.MULTIMATIC_API_PATH,
                url: this.path,
                method: 'POST',
                data: { room, temperature, duration },
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                }
            };

            await axios.request(requestConfig);
        } catch (e) {
            return errorHandler(e);
        }
    }
}

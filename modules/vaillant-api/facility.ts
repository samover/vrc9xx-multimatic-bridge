import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {errorHandler} from "./errorHandler";
import { ApiPath } from "./ApiPath";
import {VaillantApiResponse} from "./common/interfaces/vaillantApiResponse.interface";

export interface FacilityModel {
    serialNumber: string;
    name: string;
    capabilities: string[],
}

export class Facility {
    private sessionId: string;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
    }

    public getList = async (): Promise<FacilityModel[]> => {
        try {
            const requestConfig: AxiosRequestConfig = {
                url: ApiPath.facilitiesList(),
                method: 'GET',
                headers: {
                    Cookie: `JSESSIONID=${this.sessionId}`,
                }
            };

            const response =  await axios.request<VaillantApiResponse>(requestConfig);
            return response.data && response.data.body && response.data.body.facilitiesList;
        } catch (e) {
            errorHandler(e);
        }
    };
}

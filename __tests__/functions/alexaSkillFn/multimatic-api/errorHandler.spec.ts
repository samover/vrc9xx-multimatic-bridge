import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LOGGER } from 'logger';
import { errorHandler } from '../../../../functions/alexaSkillFn/multimatic-api/errorHandler';

jest.mock('logger');

class AxiosErrorExtension implements AxiosError {
    code: string;
    config: AxiosRequestConfig;
    isAxiosError: boolean;
    message: string;
    name: string;
    request: any;
    response: AxiosResponse<any>;
    stack: string;
    toJSON: () => object;
}

const axiosResponse: AxiosResponse = {
    config: undefined, data: 'data', headers: undefined, status: 403, statusText: 'Forbidden'
};
const axiosConfig: AxiosRequestConfig = { method: 'DELETE' };
const axiosRequest: AxiosRequestConfig = { method: 'GET' };

describe('MultimaticApi.errorHandler', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('#responseError: logs axiosError response', () => {
        const axiosError = new AxiosErrorExtension();
        axiosError.response = axiosResponse;
        axiosError.config = axiosConfig;
        expect(() => errorHandler(axiosError)).toThrow(Error);
        expect(LOGGER.debug).toHaveBeenNthCalledWith(1, axiosError.config, expect.anything());
        expect(LOGGER.debug).toHaveBeenNthCalledWith(2, axiosError.response.statusText, axiosError.response.data, expect.anything());
    });
    it('#requestError: logs axiosError request', () => {
        const axiosError = new AxiosErrorExtension();
        axiosError.request = axiosRequest;
        axiosError.config = axiosConfig;
        expect(() => errorHandler(axiosError)).toThrow(Error);
        expect(LOGGER.debug).toHaveBeenNthCalledWith(1, axiosError.config, expect.anything());
        expect(LOGGER.debug).toHaveBeenNthCalledWith(2, axiosError.request, expect.anything());
    });
    it('#otherError: logs axiosError request', () => {
        const axiosError = new AxiosErrorExtension();
        axiosError.message = 'errorMessage';
        axiosError.config = axiosConfig;
        expect(() => errorHandler(axiosError)).toThrow(Error);
        expect(LOGGER.debug).toHaveBeenNthCalledWith(1, axiosError.config, expect.anything());
        expect(LOGGER.debug).toHaveBeenNthCalledWith(2, axiosError.message, expect.anything());
    });
});

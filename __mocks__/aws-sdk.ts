import { readFileSync } from 'fs';

export interface AwsSdkMocks {
    SSMGetParameterMock: jest.Mock;
}

const SSMGetParameterMock = jest.fn();
const SSMGetParametersMock = jest.fn();

class SSMMock {
    public getParameter() {}
}

SSMMock.prototype.getParameter = SSMGetParameterMock.mockImplementation((options) => {
    return options.Name.match(/private/)
        ? { promise: async () => ({ Parameter: { Value: readFileSync('./__mocks__/resources/rsa256.key') } }) }
        : { promise: async () => ({ Parameter: { Value: readFileSync('./__mocks__/resources/rsa256.key.pub') } }) };
});

// tslint:disable-next-line:variable-name
export const __getMocks__ : AwsSdkMocks = {
    SSMGetParameterMock,
};

export const SSM = SSMMock;

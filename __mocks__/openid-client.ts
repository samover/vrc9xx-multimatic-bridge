export interface OpenidClientMocks {
    authorizationUrlMock: jest.Mock;
    discoverMock: jest.Mock;
    grantMock: jest.Mock;
    openIdMockClient: jest.Mock;
}

const authorizationUrlMock = jest.fn().mockResolvedValue('authorizationUrl');
const grantMock = jest.fn().mockResolvedValue('tokens');
const openIdMockClient = jest.fn().mockImplementation(() => ({ authorizationUrl: authorizationUrlMock, grant: grantMock }));
const discoverMock = jest.fn().mockResolvedValue({ Client: openIdMockClient });

// tslint:disable-next-line:variable-name
export const __getMocks__ : OpenidClientMocks = {
    authorizationUrlMock,
    discoverMock,
    grantMock,
    openIdMockClient,
};

export const Issuer = {
    discover: discoverMock,
};

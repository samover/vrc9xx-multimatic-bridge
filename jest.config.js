module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    testPathIgnorePatterns: [
        "/vaillant-api-tests",
        "/__helpers",
        "/__mocks"
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
    modulePaths: [
        "<rootDir>/modules/"
    ],
    setupFiles: ['./testSetup.js'],
    collectCoverageFrom: [
        "modules/**/*.{ts,tsx}",
        "functions/**/*.{ts,tsx}",
    ]
};

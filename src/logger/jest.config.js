module.exports = {
    preset: 'ts-jest',
    coverageDirectory: './coverage/',
    collectCoverage: false,
    collectCoverageFrom: ['./src/**/*.ts'],
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*\.spec\.ts)',
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.test.json',
        },
    },
};

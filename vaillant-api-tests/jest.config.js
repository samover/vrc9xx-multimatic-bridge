module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/.*|(\\.|/)(test|spec))\\.[t]sx?$',
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
    setupFiles: ['./testSetup.js']
};

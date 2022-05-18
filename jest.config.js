/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '((?<!build)/tests/.*|(.|/)(test|spec)).ts$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    passWithNoTests: true, // TODO: xd
};

module.exports = config;

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  testResultsProcessor: 'jest-sonar-reporter',
  transformIgnorePatterns: ['node_modules/(?!(lowercase-keys))'],
  modulePaths: ['<rootDir>'],
};

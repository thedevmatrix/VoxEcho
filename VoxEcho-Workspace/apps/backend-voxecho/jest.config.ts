/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
  displayName: 'backend-voxecho',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/backend-voxecho',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/jest-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  rootDir: '.',
} as Config;

export default config;

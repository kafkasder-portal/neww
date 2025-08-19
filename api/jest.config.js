/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
<<<<<<< HEAD
    '^.+\.ts$': ['ts-jest', {
      useESM: true
    }]
=======
    '^.+\\.ts$': 'ts-jest'
>>>>>>> 686e8fd5c317be0c6813aba7437400939cd49c3c
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!server.ts',
    '!tests/**',
    '!node_modules/**',
    '!dist/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapping: {
    '^express-validator$': 'express-validator/lib/index.js'
  }
};
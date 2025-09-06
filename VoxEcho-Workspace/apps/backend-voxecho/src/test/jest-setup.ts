import { jest, beforeAll, afterAll, afterEach } from '@jest/globals';

// This is where we can add global test setup
beforeAll(() => {
  // Add any global setup here
});

afterAll(() => {
  // Add any global cleanup here
});

// Reset all mocks after each test
afterEach(() => {
  jest.resetAllMocks();
});

// Add global mocks if needed
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key: unknown) => {
      // Add your environment variables here
      const envs: { [key: string]: string } = {
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        JWT_SECRET: 'test-secret',
      };
      return typeof key === 'string' ? envs[key] : undefined;
    }),
  })),
}));

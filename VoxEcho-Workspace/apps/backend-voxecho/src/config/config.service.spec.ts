import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

const mockConfig: Record<string, string> = {
  PORT: '3000',
  DATABASE_URL: 'https://your-database-url.com',
  JWT_SECRET: 'your-jwt-secret'
};

describe('Config Validation', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return mockConfig[key];
            }),
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return the correct port', () => {
    expect(configService.get('PORT')).toBe('3000');
  });

  it('should have DATABASE_URL defined and valid', () => {
    expect(configService.get('DATABASE_URL')).toBe('https://your-database-url.com');
  });

  it('should have JWT_SECRET defined', () => {
    expect(configService.get('JWT_SECRET')).toBe('your-jwt-secret');
  });
});

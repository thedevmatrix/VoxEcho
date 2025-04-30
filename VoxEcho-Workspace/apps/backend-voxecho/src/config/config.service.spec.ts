import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './validation';

describe('Config Validation', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    // Mock environment variables with valid values
    process.env.PORT = '3000'; // Valid port
    process.env.DATABASE_URL = 'https://your-database-url.com'; // Valid URL
    process.env.JWT_SECRET = 'your-jwt-secret'; // Valid JWT secret

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate: (config) => {
            const parsed = envSchema.safeParse(config);
            if (!parsed.success) throw new Error(parsed.error.message);
            return parsed.data;
          },
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return the correct port', () => {
    expect(configService.get('PORT')).toBe('3000'); // Ensuring the mock env variable is returned
  });

  it('should have DATABASE_URL defined and valid', () => {
    expect(configService.get('DATABASE_URL')).toBe('https://your-database-url.com');
  });

  it('should have JWT_SECRET defined', () => {
    expect(configService.get('JWT_SECRET')).toBe('your-jwt-secret');
  });
});

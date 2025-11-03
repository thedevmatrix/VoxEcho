import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { regDto } from '../dto/reg.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities /user.entity';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
    verifyAsync: jest.fn().mockResolvedValue('mocked-jwt-token')
  };

  const mockUserRepository = {
    create: jest.fn((dto) => dto), // simulate create just returning the dto
    save: jest.fn((dto) => Promise.resolve({ ...dto, id: 1 })), // simulate save returning user with id
    findOne: jest.fn().mockResolvedValue({ id: 1, email: 'admin@example.com' })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mocks for bcrypt
  beforeAll(() => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((plain, hashed) => {
      return Promise.resolve(plain === 'admin123' || plain === 'pass'); // simulate password match
    });

  (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashed-password');

  });

  // Test for registration
  describe('registratedUser', () => {
    it('should throw UnauthorizedException if user already exists', async () => {
      const mockUser = { username: 'admin2' };

      const regdto = new regDto();
      regdto.username = 'admin2';
      regdto.password = 'admin123';
      regdto.comfirmPass = 'admin123';

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.userRegistration(regdto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user if user does not exist', async () => {
      const regdto = new regDto();
      regdto.username = 'admin2';
      regdto.password = 'admin123';
      regdto.comfirmPass = 'admin123';

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(null);

      const res = await authService.userRegistration(regdto);
      expect(res).toMatchObject({
        username: 'admin2',
      });
      expect(res).not.toHaveProperty('password');
    });

    it('should return new user without password', async () => {
      const regdto = new regDto();
      regdto.username = 'admin23';
      regdto.password = 'admin12345';
      regdto.comfirmPass = 'admin12345';

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(null);

      const result = await authService.userRegistration(regdto);
      expect(result).toMatchObject({
        username: 'admin23',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('password should match and user returned', async () => {
      const regdto = new regDto();
      regdto.username = 'admin2';
      regdto.password = 'admin123';
      regdto.comfirmPass = 'admin123';
      regdto.email = 'admin@example.com';

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.userRegistration(regdto);

      expect(result).toMatchObject({
        username: 'admin2',
        email: 'admin@example.com',
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  // Tests for validation
  describe('validateUser', () => {
    it('should return user and token when user is valid', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
      };

      const logindto = new LoginDto();
      logindto.username = 'admin';
      logindto.password = 'admin123';

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateUser(logindto);

      expect(result.User).toMatchObject({ id: 1, username: 'admin' });
      expect(result.access_token).toBeDefined();
    });

    it('should throw if user not found', async () => {
      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.validateUser({
          username: 'test',
          password: 'pass',
          id: 0,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the user does not exist', async () => {
    const logindto = new LoginDto();
    logindto.username = 'admin444';
    logindto.password = 'somepass';

    (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(null);

    await expect(authService.validateUser(logindto)).rejects.toThrow(UnauthorizedException);
});


    it('should return user and token on valid credentials', async () => {
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash('pass', 10),
      };

      (mockUsersService.findByUsername as jest.Mock).mockResolvedValue(user);

      const result = await authService.validateUser({
        username: 'test',
        password: 'pass',
        id: 0,
      });

      expect(result).toHaveProperty('access_token');
      expect(result.User.username).toBe('test');
    });
  });

  it('should hash and save new password successfully', async () => {
      const mockUser = {
         id: 1, 
         password: 'old'
         };
      (mockJwtService.verifyAsync as jest.Mock) = jest.fn().mockReturnValue({ sub: 1 });
      (mockUserRepository.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      (mockUserRepository.save as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await authService.resetPassword('reset-token', 'new123');
      expect(bcrypt.hash).toHaveBeenCalledWith('new123', 10);
      expect(mockUser.password).toBe('hashed-password');
      expect(result.message).toMatch(/success/i);
    });

it('should throw error if user not found', async () => {
      (mockUserRepository.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);
      await expect(authService.forgotPassword('unknown@mail.com'))
        .rejects.toThrow('User is not found');
    });

    it('should return reset token if user exists', async () => {
      const mockUser = { id: 1, email: 'admin@example.com' };
      (mockUserRepository.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValue('reset-token');

      const result = await authService.forgotPassword('admin@example.com');
      expect(result).toEqual({ message : 'Reset link sent',token: 'reset-token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: 1 });
    });
 

    
});

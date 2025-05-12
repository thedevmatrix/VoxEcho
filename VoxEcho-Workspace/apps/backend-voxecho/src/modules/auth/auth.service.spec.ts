import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule} from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let  usersService: Partial <UsersService>;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET', 
          signOptions: {expiresIn: '60m'}
        })
      ],
      providers: [
        AuthService,
        {provide: UsersService, useValue: usersService},

      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', ()=>{
    it('should return  user without password if valid', async()=>{
      const mockUser ={
        id: 1,
        username:'admin',
        password: await bcrypt.hash('admin123', 10)
      };
      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);
     
      const result = await authService.validateUser('admin', 'admin123');

      expect(result).toEqual({ id: 1, username: 'admin'}); // exclude the password
      
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),  // Hashed password
      };
    
      // Mocking the findByUsername method to return the mock user
      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      
      // Expecting the UnauthorizedException to be thrown if the password is invalid
      await expect(authService.validateUser('admin', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
    
    
    it('should return null if the user dosent exit ', async()=>{
      

      (usersService.findByUsername as jest.Mock).mockResolvedValue(null)
      const result = await authService.validateUser('admin', 'admin123');
      expect(result).toBeNull();

    });

    describe('signToken', ()=>{

    it('should return the valid payload ', async()=>{
      const mockUser = {
        id: 1,
        username: 'admin',
        password: 'admin123'
      };

      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.signToken({ id: 1, username: 'admin' });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.split('.')).toHaveLength(3)

    });

    });

  });

  
});

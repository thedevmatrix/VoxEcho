import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule} from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { regDto } from '../dto/reg.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let  usersService: Partial <UsersService>;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn(),
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
        {
          provide: UsersService, 
          useValue: usersService
        },

      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

// mock for registration user 
  describe('registratedUser', ()=>{

    it('should throw an unauthourize error if user exit', async() => { 
      const mockUser = {
        username : 'admin2'
      }
      
      
      const regdto = new regDto()
      regdto.username =  'admin2';
      regdto.password = 'admin123';
      regdto.comfirmPass = 'admin123';

      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser)   

      await expect (authService.userRegistration(regdto)).rejects.toThrow(UnauthorizedException)
    })



    it('should return user if user do not  exist findusername method', async() => {
     const regdto = new regDto()
     
       regdto.username =  'admin2';
       regdto.password = 'admin123';
       regdto.comfirmPass = 'admin123';

      (usersService.findByUsername as jest.Mock).mockResolvedValue(null)

     
      const res = await authService.userRegistration(regdto)
      expect(res).toEqual({
         username: 'admin2', 

      })
    })

    
    it('should return new user wihtout password', async() => {

       const regdto = new regDto()
       regdto.username =  'admin23';
       regdto.password = 'admin12345';
       regdto.comfirmPass = 'admin12345';

      const result = await authService.userRegistration(regdto)
      expect(result).toEqual({
         username : 'admin23'
      }) // expect result that exclude the password 

    });

   it('password should match', async () => {
  const regdto = new regDto();
  regdto.username = 'admin2';
  regdto.password = 'admin123';
  regdto.comfirmPass = 'admin123';
  regdto.Email = 'admin@example.com';

  (usersService.findByUsername as jest.Mock).mockResolvedValue(undefined);

   
  const result = await authService.userRegistration(regdto);

  expect(result).toEqual({
    username: 'admin2',
    Email: 'admin@example.com',
  });
});


  })


  // auth vlaidation 
  describe('validateUser', ()=>{
    
    it('should return  user without password if valid', async()=>{
      const mockUser = {
        id : 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),  // Hashed password
      };
  
      const logindto = new LoginDto();
      logindto.username = 'admin'
      logindto.password = 'admin123';

      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);
     
      const result = await authService.validateUser(logindto);

      expect(result).toEqual({ id: 1, username: 'admin'}); // exclude the password
      
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),  // Hashed password
      };

      const logindto = new LoginDto();
      logindto.username = 'admin';
      logindto.password = 'admin13';

      // Mocking the findByUsername method to return the mock user
      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      
      // Expecting the UnauthorizedException to be thrown if the password is invalid
      await expect(authService.validateUser(logindto)).rejects.toThrow(UnauthorizedException);
    });
    
    
    it('should return null  if the user dosent exit ', async()=>{
      
      
      const logindto = new LoginDto();
      logindto.username = 'admin444';

      (usersService.findByUsername as jest.Mock).mockResolvedValue(null)

      const result = await authService.validateUser(logindto);

      expect(result).toBe(null);

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

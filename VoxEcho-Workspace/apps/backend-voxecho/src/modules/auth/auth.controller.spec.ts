import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request } from 'express';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      controllers: [AuthController],
      providers: [
        {
        provide: AuthService, 
        useValue: {
        signToken : jest.fn().mockResolvedValue('mock-token'),
        validateUser: jest.fn().mockResolvedValue({id: 1, username: 'admin'})
        }
    }
  ]
    }).compile();

    authController = module.get<AuthController>(AuthController);

   
  });
  describe('login', ()=>{
    it('should access route ', async () => {
      const mockRequest = {
        username: 'admin' ,
        password: 'admin123'

      } ;

      const result = await authController.login(mockRequest); 
      

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
    });

  });

  describe('profile', ()=>{
    it('should return user payload  ', async()=>{
      const mockUser = {id: 1, username: 'admin'};
      const mockRequest = {user: mockUser}as  Partial<Request> as Request
      const result = await authController.getProfile(mockRequest);
      expect(result).toEqual(mockUser)

    });

  })

  
});

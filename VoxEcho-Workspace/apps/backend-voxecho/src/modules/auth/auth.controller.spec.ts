import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest')
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { regDto } from '../dto/reg.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let  app : INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      controllers: [AuthController],
      providers: [
        {
        provide: AuthService, 
        useValue: {
        signToken : jest.fn().mockResolvedValue('mock-token'),
        userRegistration: jest.fn().mockResolvedValue(
          {
          id: 3,
          username: 'admin123',
          email:  'admin123@gmail.com'
        }),
        validateUser: jest.fn().mockResolvedValue({id: 1, username: 'admin'})
        }
    }
  ]
    }).compile();
     app = module.createNestApplication()
    await app.init()

    authController = module.get<AuthController>(AuthController);
    

   
  });

  describe('registration', ()=>{
    it('should return the user route  and return a 201', async () => {
     const regdto = new regDto()
      regdto.name = 'emmy';
      regdto.lastName = 'fund';
      regdto.username =  'admin23';
      regdto.Email = 'abannkdkmkdkn@gmail.com'; 
      regdto.password = 'admin12345';
      regdto.comfirmPass = 'admin12345';
      regdto.day = 2;
      regdto.month = 6; 
      regdto.year = 1997; 

      
     const res = await request(app.getHttpServer())
     .post('/auth/registration')
     .send(regdto)
     .expect(201)

      expect(res.body).toEqual(
       {
          id: 3,
          username: 'admin123',
          email:  'admin123@gmail.com'
      })
    })
  })
  describe('login', ()=>{
    it('should access route ', async () => {
     const logindto = new LoginDto();
           logindto.id = 1;
           logindto.username = 'admin';
           logindto.password = 'admin123';


      const result = await authController.login(logindto); 
      

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
    });

  });

  describe('profile', ()=>{
    it('should return user payload  ', async()=>{
      const mockUser = {id: 1, username: 'admin'};
      const mockRequest = {user: mockUser}as  Partial<typeof request> as typeof request
      const result = await authController.getProfile(mockRequest);
      expect(result).toEqual(mockUser)

    });

  })

  
});

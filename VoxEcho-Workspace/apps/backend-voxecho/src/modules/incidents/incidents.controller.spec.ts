import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { createIncidentDto } from '../dto/incidentDto/incidentPost.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/AuthJwt.strategy';
import { Reflector } from '@nestjs/core';
import { CustomConfigService } from '../../config/config.service';


    //-->  this checks if request is permitted before hitting the auth guard.
    class MockAuthGuard implements CanActivate {
      canActivate(){
        return Promise.resolve(true) 
      }
    }

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let service: IncidentsService;
  



   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
          useValue: { 

          handleIncidentUpload: jest.fn(),
          createIncidentDto: jest.fn()
          }
        },
        {
          provide: JwtService, 
          useValue: {Verify: jest.fn()}
        },
              { provide: AuthGuard, useValue: { canActivate: jest.fn(() => true) } 
            },
                  { 
                    provide: Reflector, useValue: {} 
                },
                {
                  provide: CustomConfigService,  useValue: {}
                }



        
      ],
    })
    .overrideGuard(MockAuthGuard)
    .useValue({ canActivate: () => true})
    .compile();

  controller = module.get<IncidentsController>(IncidentsController);
  service = module.get<IncidentsService>(IncidentsService);
});



  it('should include file image to the updated body', async () => {
  const mockFile = { filename: 'test.jpg' } as Express.Multer.File;

  const mockUser = {
    user: { id: 1 }
  };

  const body: createIncidentDto = {} as any;


  // Mock the service method and simulate its internal logic
  jest
    .spyOn(service, 'handleIncidentUpload')
    .mockImplementation(async (dto, file , userId) => {
      dto.file =  file.filename;

      return {
      id: 1,
      tietle: dto.title,
      content: dto.content,
      file: dto.file,
      lsocation: dto.location,
      ucreatedAt: new Date(),
      updatedAt: new Date(),
      isActive: true,

      user: () => ({
        id: userId,
        username: 'testUser',
        firstname: 'admin',
        lastName: 'add',
        password: 'hashed',
        email: 'test@example.com',
        dob: new Date(7-6-1997),
        isActive: false,

      }),

      comments: () => [],
      votes: ()=> []
      
      } as any 

    
     
    });

  // Await the controller method
  const result = await controller.uploadFileAndValidate(mockFile, body, mockUser);

  // Assert the file value
  expect(body.file).toBe('test.jpg'); 

  expect(service.handleIncidentUpload).toHaveBeenCalledWith(body, mockFile, 1);
  expect(result).toBeDefined();
});








  
});

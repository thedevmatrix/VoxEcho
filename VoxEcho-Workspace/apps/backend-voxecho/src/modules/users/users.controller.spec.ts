import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;


  const mockUsersService = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, useValue: mockUsersService

        },
        
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService)
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should call findByUsername in service', async () => {
    mockUsersService.findByUsername.mockResolvedValue({ id: 1, username: 'john' });
    const result = await usersController.findByUsername('john');
    expect(result).toEqual({ id: 1, username: 'john' });
    expect(usersService.findByUsername).toHaveBeenCalledWith('john');
  });

  it('should call findById in service', async () => {
    mockUsersService.findById.mockResolvedValue({ id: 2, username: 'doe' });
    const result = await usersController.findById(2);
    expect(result).toEqual({ id: 2, username: 'doe' });
    expect(usersService.findById).toHaveBeenCalledWith(2);
  });

  it('should call remove in service', async () => {
    mockUsersService.remove.mockResolvedValue({ id: 3, username: 'deletedUser' });
    const result = await usersController.removeById(3);
    expect(result).toEqual({ id: 3, username: 'deletedUser' });
    expect(usersService.remove).toHaveBeenCalledWith(3);
  });
  
});

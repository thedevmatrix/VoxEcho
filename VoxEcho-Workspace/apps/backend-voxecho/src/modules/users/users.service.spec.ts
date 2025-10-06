import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';


describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;


  const mockUsers: User[] = [
    { id: 1, username: 'john'} as User
  ];
  
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOneBy: jest.fn(({ id, username }) =>
      Promise.resolve(mockUsers.find(u => u.id === id || u.username === username) || null)
    ),
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockUsers);
    expect(repo.find).toHaveBeenCalled();
  });

   it('should find user by username', async () => {
    const result = await service.findByUsername('john');
    expect(result).toEqual(mockUsers[0]);
    expect(repo.findOneBy).toHaveBeenCalledWith({ username: 'john' });
  });

   

  it('should find user by id', async () => {
    const result = await service.findById(1);
    expect(result).toEqual(mockUsers[0]);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
  
});

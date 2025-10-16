import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { Repository } from 'typeorm';
import { Post } from '../entities /incidentPost.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createIncidentDto } from '../dto/incidentDto/incidentPost.dto';
describe('IncidentsService', () => {
  let service: IncidentsService;
  let repo : Repository<Post>


  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn()
  }

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService, 
        {
          provide: getRepositoryToken(Post),  useValue: mockPostRepository
         }

       
      
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post))
    
    
  });

  afterEach(()=> jest.clearAllMocks());

it('should create and save a post', async () => {
    const dto: createIncidentDto = {
      title: 'Test',
      content: 'Content',
      file: 'file.png',
      location: [{
        latitude: 5.6, longitude: 3.3,
        placeName: 'lagos',
        placeId: '4'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const fakePost = { ...dto, id:1}

    mockPostRepository.create.mockReturnValue(fakePost)
    mockPostRepository.save.mockResolvedValue(fakePost);

    const result = await service.createIncident(dto, 1 );

    expect(repo.create).toHaveBeenCalledWith({
      id: 1,
      ...dto,

      //used matcher for literal date 
      updatedAt: expect.any(Date)
    });

    expect(repo.save).toHaveBeenCalledWith(fakePost);
    expect(result).toEqual(fakePost)
  });

  it('should find post by id (sharePost)', async () => {
    const fakePost = { id: 3, title: 'Post 3' };
    mockPostRepository.findOneBy.mockResolvedValue(fakePost);

    const result = await service.sharePost(3);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 3 });
    expect(result).toEqual(fakePost);
  });

  /*it('should find post with location', async () => {
    const fakePost = { id: 4, location: 'lagos', title: 'Post 4' };
    mockPostRepository.findOneBy.mockResolvedValue(fakePost);

    const result = await service.findPostWithLocation([]);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 4 });
    expect(result).toEqual(fakePost);
  }); */

 


});

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentVotesService } from './incident-votes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Votes } from '../../entities /incident-votes.entity';
import { Repository } from 'typeorm';

describe('IncidentVotesService', () => {
  let service: IncidentVotesService;
  let votesRepository: Repository<Votes>;

  const mockVotesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentVotesService,
        {
          provide: getRepositoryToken(Votes),
          useValue: mockVotesRepository,
        },
      ],
    }).compile();

    service = module.get<IncidentVotesService>(IncidentVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

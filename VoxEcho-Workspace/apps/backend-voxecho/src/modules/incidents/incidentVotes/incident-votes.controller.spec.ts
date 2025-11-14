import { Test, TestingModule } from '@nestjs/testing';
import { IncidentVotesController } from './incident-votes.controller';
import { IncidentVotesService } from './incident-votes.service';

describe('IncidentVotesController', () => {
  let controller: IncidentVotesController;
  let service: IncidentVotesService;

  const mockIncidentVotesService = {
    addVote: jest.fn(),
    removeVote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentVotesController],
      providers: [
        {
          provide: IncidentVotesService,
          useValue: mockIncidentVotesService,
        },
      ],
    }).compile();

    controller = module.get<IncidentVotesController>(IncidentVotesController);
    service = module.get<IncidentVotesService>(IncidentVotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentVotesService } from './incident-votes.service';

describe('IncidentVotesService', () => {
  let service: IncidentVotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentVotesService],
    }).compile();

    service = module.get<IncidentVotesService>(IncidentVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentVotesController } from './incident-votes.controller';

describe('IncidentVotesController', () => {
  let controller: IncidentVotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentVotesController],
    }).compile();

    controller = module.get<IncidentVotesController>(IncidentVotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

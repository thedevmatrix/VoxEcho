import { Module } from '@nestjs/common';
import { IncidentVotesController } from './incident-votes.controller';
import { IncidentVotesService } from './incident-votes.service';

@Module({
  controllers: [IncidentVotesController],
  providers: [IncidentVotesService],
})
export class IncidentVotesModule {}

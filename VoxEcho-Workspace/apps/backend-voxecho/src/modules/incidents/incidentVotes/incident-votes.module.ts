import { Module } from '@nestjs/common';
import { IncidentVotesController } from './incident-votes.controller';
import { IncidentVotesService } from './incident-votes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Votes } from '../../entities /incident-votes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Votes])
  ],
  controllers: [IncidentVotesController],
  providers: [IncidentVotesService],
})
export class IncidentVotesModule {}

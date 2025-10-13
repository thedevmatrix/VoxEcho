import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities /incidentPost.entity';
import { IncidentVotesModule } from './incidentVotes/incident-votes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), IncidentVotesModule],
  controllers: [IncidentsController],
  providers: [IncidentsService],

  exports: [IncidentsService, TypeOrmModule],
})
export class IncidentsModule {}

import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities /incidentPost.entity';
import { IncidentVotesModule } from './incidentVotes/incident-votes.module';
import { LocationService } from './location/location.service';import { LocationModule } from './location/location.module';
import { Comment } from '../entities /comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    IncidentVotesModule,
    LocationModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, LocationService],

  exports: [IncidentsService, TypeOrmModule],
})
export class IncidentsModule {}

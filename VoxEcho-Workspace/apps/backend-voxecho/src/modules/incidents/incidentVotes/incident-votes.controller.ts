import { Controller, Post, Body } from '@nestjs/common';
import { IncidentVotesService } from './incident-votes.service';
import {  VoteType } from '../../entities /incident-votes.entity';
@Controller('votes')
export class IncidentVotesController {
  constructor(private readonly voteService: IncidentVotesService) {}

  @Post()
  castVote(@Body() body: { userId: number; postId: number; type: VoteType}) {
    return this.voteService.castVote(body.userId, body.postId, body.type);
  }
}

/// for the incident search , we need a logic , where user can search incident by key words and locations ....   keyword for incident that happens and location search for closeby incident base on location ...     


// this should be done inside incident service and controller . 
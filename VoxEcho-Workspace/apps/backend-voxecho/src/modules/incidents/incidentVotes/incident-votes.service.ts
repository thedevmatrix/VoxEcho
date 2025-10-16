import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Votes, VoteType } from '../../entities /incident-votes.entity';
@Injectable()
export class IncidentVotesService {
  constructor(
    @InjectRepository(Votes) private voteRepo: Repository<Votes>,
   
  ) {}

  async castVote(
    userId: number, 
    postId: number,
    type: VoteType ) {
    const existing = await this.voteRepo.findOneBy({ 
     userId
    }); 
    //prevent user from voting twice by checking if  existing  vote is available . 
    
    if (existing) {
      existing.type = type;  //changes type  to the existing vote 
      return await this.voteRepo.save(existing);
    }
    return this.voteRepo.save({ user: { id: userId }, post: { id: postId }, type });
  }
}




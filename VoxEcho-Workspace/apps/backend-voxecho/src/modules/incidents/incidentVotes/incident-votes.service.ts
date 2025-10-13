import { Injectable } from '@nestjs/common';

@Injectable()
export class IncidentVotesService {}


// working on the voting logic , more releevant appears more on the timelines.

//steps to create the voting logic ,
//write schema for the voting logic
//once an incident is voted for the trust increases 
//prevent user from voting twice by checking if  vote is available . changes from upvote to down vote. 

//this should have a service, controller and a module file . 
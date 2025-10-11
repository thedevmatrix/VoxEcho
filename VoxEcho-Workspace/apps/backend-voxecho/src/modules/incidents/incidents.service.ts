import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { createIncidentDto } from '../dto/incidentDto/incidentPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Post } from '../entities /incidentPost.entity';

@Injectable()
export class IncidentsService {

    constructor( 
      @InjectRepository(Post)
        
      private usersRepository: Repository<Post>,
    ){}

    async handleIncidentUpload(dto: createIncidentDto, file : Express.Multer.File, userId: number ){
      if(!file)
        throw new UnauthorizedException('file must be uploaded')
      dto.file = file.filename;
      return this.createIncident(dto, userId)
      

    }

    async createIncident(dto: createIncidentDto, userId: number){

         
        //create a new post that get dto and userid for post request.
        const post = this.usersRepository.create({
             id: userId,
             title : dto.title,
             content: dto.content,
             file: dto.file, //no strict dt request
             location: dto.location, //no strict dt request
             createdAt : dto.createdAt,
             updatedAt: dto.updatedAt
             
 
        })
        
        //created expression for validation 
        // saviing file in localstore with post 
        return await this.usersRepository.save(post)
 
    }

    //delete post 
    async deletePost(id: number ) : Promise<DeleteResult | null> {
      return this.usersRepository.delete({id})
    }

    //share post place holder, need real logic
    async sharePost (id: number) : Promise<Post | null>{
      return this.usersRepository.findOneBy({id})
    }


    //place holder method , needs real logic 
    async findPost (id: number): Promise<Post |null>{
      return this.usersRepository.findOneBy({id})
    }





   

   
    
}



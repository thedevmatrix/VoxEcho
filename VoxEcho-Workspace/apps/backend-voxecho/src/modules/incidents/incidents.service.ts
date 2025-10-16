import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { createIncidentDto } from '../dto/incidentDto/incidentPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Post } from '../entities /incidentPost.entity';
import { LocationService } from './location/location.service';

@Injectable()
export class IncidentsService {

    constructor( 
      @InjectRepository(Post)
        
      private usersRepository: Repository<Post>,
      private locationService: LocationService 
    ){}

    async handleIncidentUpload(dto: createIncidentDto, file : Express.Multer.File, userId: number ){
      if(!file)
        throw new UnauthorizedException('file must be uploaded')
      dto.file = file.filename;


      const location = await this.locationService.getPlaceFromCoords(
        dto.location[0].latitude,
        dto.location[0].longitude
      )

      dto.location[0].placeName = location.placeName
      return this.createIncident(dto, userId)
      

    }


    // this is the function that create and store incident to db.
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
    async sharePost(id: number) : Promise<Post | null>{
      return this.usersRepository.findOneBy({id})
    }


    //place holder method , needs real logic 
    // this should be have a param for location... ?? should it be a string ?

    // we call for the loaction service here. 
    //--> brings location straight from db. 
    async findPostWithLocation (location: []): Promise<Post |null>{
      return this.usersRepository.findOneBy({
        location
      })
    }

    // user can seravh for post 


    // ==> service file  =>interact with db , and then make it possibe for user to make a request in contrller file.

    //If location is provided, filter incidents within the specified radius
//If time range is provided, only return incidents between from and to
//If tags are specified, include only those matching all or any (configurable)

//location base features .... 

// you can search from inputed location and also user can filter via location km, mile and etc. 


// we are suppose to load a list of post base on the search filter . 

}
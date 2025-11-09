import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createIncidentDto } from '../dto/incidentDto/incidentPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from '../entities /incidentPost.entity';
import { LocationService } from './location/location.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Post)
    private usersRepository: Repository<Post>,
    private locationService: LocationService
  ) {}

  async handleIncidentUpload(
    dto: createIncidentDto,
    file: Express.Multer.File,
    userId: number
  ) {
    if (!file) throw new UnauthorizedException('file must be uploaded');
    dto.file = file.filename;

    const location = await this.locationService.getPlaceFromCoords(
      dto.location[0].latitude,
      dto.location[0].longitude
    );

    dto.location[0].placeName = location.placeName;
    return this.createIncident(dto, userId);
  }

  // this is the function that create and store incident to db.
  async createIncident(dto: createIncidentDto, userId: number) {
    //create a new post that get dto and userid for post request.
    const post = this.usersRepository.create({
      id: userId,
      title: dto.title,
      content: dto.content,
      file: dto.file, //no strict dt request
      location: dto.location, //no strict dt request
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });

    //created expression for validation
    // saviing file in localstore with post
    return await this.usersRepository.save(post);
  }

  //delete post
  async deletePost(id: number): Promise<DeleteResult | null> {
    return this.usersRepository.delete({ id });
  }

  //share post place holder, need real logic
  async sharePost(id: number): Promise<Post | null> {
    return this.usersRepository.findOneBy({ id });
  }

  //place holder method , needs real logic
  // this should be have a param for location... ?? should it be a string ?

  // user can search  for post
  // we call for the location service here.
  //--> brings filered post via location straight from db.
  async findPostsByLocation(location: string): Promise<Post[]> {
    try {
      return await this.usersRepository.find({
        where: { location: ILike(`%${location}%`) },
      });
    } catch (error) {
      console.error('No posts found for this location', error);
      return [];
    }
  }

  //function that filter incident post by date.
  async filterPostsByTime(range: '24h' | '7d' | '3m' | '6m' | '1y') {
    try {
      const now = new Date();
      let startDate = new Date(now);

      if (range === '24h')
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (range === '7d')
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (range === '3m') startDate.setMonth(startDate.getMonth() - 3);
      else if (range === '6m') startDate.setMonth(startDate.getMonth() - 6);
      else if (range === '1y')
        startDate.setFullYear(startDate.getFullYear() - 1);

      return await this.usersRepository.find({
        where: { createdAt: MoreThanOrEqual(startDate) },
      });
    } catch (error) {
      console.error('no post found', error);
      return null;
    }
  }
}

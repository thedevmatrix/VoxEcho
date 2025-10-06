import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';



@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    // find all user 
    async findAll():Promise<User[]>{
        return this.usersRepository.find();
    }
    

// find user by username 
   async findByUsername(username: string):Promise<User | null>{
         return this.usersRepository.findOneBy({username})
    }

     //find user by id 
    async findById( id:number):Promise<User | null>{
        return this.usersRepository.findOneBy({id})
    }

     //remove user by id 
    async remove(id: number) : Promise<User | null>{
        return this.usersRepository.findOneBy({id})
    }
   
}
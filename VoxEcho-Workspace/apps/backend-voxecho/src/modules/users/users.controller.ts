import {  Controller, Get, Param, Delete} from '@nestjs/common';
import { UsersService } from './users.service';

//--> User controller doesn't have a route, because auth controller has covered user route, so this controller wont route to any point , instead controller will just  return the mehtod of it service file. <--//

// for direct route admin users/ ext api 

@Controller('users')
export class UsersController {

     constructor( private readonly userService : UsersService ){}
    @Get(':username')
    findByUsername( @Param('username')username: string ){ 
        // get user method 
       return this.userService.findByUsername(username)
    }
    @Get('id/: id')
    findById (@Param('id')id: number){
        return this.userService.findById(+id)
    }

    @Delete(':id')
    removeById(id: number){
        return this,this.userService.remove(+id)
    }

}
 



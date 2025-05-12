import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly mockUser = {
        id: 1, 
        username : 'admin',
        password: 'admin123'
    }
    async findByUsername (username: string ){
        if(!username)
            return `usernmae must be inputed `

         return username  === this.mockUser.username? this.mockUser : null;
 }
}

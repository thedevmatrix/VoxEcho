import {  Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
   
 
    private readonly  loginUser  = [   
        {
        id: 1 , 
        username: 'admin', 
        password: 'admin123'
        }, 
        {
        id: 2 , 
        username: 'admin2', 
        password: 'admin1234'
        }
        
      ]

    
 
  

// function to find user , if it existed . 
   async findByUsername ( username: string ){ // this is a method to find user . 
        if(!username)
            return `usernmae must be inputed `;
        ///compare this current username to the logindto user data that user post . 
        const user = await this.loginUser.find(User => User.username === username)

        return user ?? null 
       
 }

 


}

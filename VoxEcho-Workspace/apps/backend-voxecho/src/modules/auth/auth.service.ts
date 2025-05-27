import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import  { UsersService } from '../users/users.service';
import { regDto } from '../dto/reg.dto';
import { LoginDto } from '../dto/login.dto';



@Injectable()
export class AuthService {
  constructor(
     private readonly usersService: UsersService, private jwtService: JwtService
  ) {}

  
  // register user
  async userRegistration(regdto: regDto){ // registration detail for all user . 

    //check if userdatails in reg exit  already existed in our finsusername login mock file 
    const user = await this.usersService.findByUsername(regdto.username) // logindto method 
    if(user ){
      throw new  UnauthorizedException(' user already exited')
    }

    const newUser =  regdto
    // check if you newUser is an object . 

    if( !newUser || typeof newUser !== 'object' || !newUser.password)
       throw new UnauthorizedException('user must be created '); 

    
    // checking if it is password is matched . 
    if(newUser.password !== newUser.comfirmPass)
      throw new UnauthorizedException(`password do no match`);

   //return newuser without password 
   const {password: passwordHash, comfirmPass: comfirmPassHash, ...newuser} = newUser

   return newuser

  }

  // validateUser using UsersService to find user by username
  async validateUser( logindto: LoginDto ) { // validate user details 
    const validUser = await this.usersService.findByUsername(logindto.username);

    if (!validUser) return null; // if user not found


    if (!validUser || typeof validUser !== 'object' || !validUser.password) {
      throw new UnauthorizedException('Invalid user data');
    }

    //compare password !
    const IsMatch =  await bcrypt.compare(logindto.password,  validUser.password )
    
    if(!IsMatch){
      throw new UnauthorizedException('wrong password ')
    }
   
    //hide password 
    const {password: _, ...User} = validUser

    return User 

    // Exclude password from user object
    
  }

  // sign token
  async signToken(user: { id: number; username: string }) {   /// assign token for  user 
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}

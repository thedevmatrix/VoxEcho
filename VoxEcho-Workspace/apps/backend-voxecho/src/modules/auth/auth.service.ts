import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { regDto } from '../dto/reg.dto';
import { LoginDto } from '../dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities /user.entity';
// we would need to store registered user to data base using the orm features 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // register user
  async userRegistration(regdto: regDto) { // registration detail for all user . 
    const user = await this.usersService.findByUsername(regdto.username); // check user form database table user 

    if (user) {
      throw new UnauthorizedException('user already existed');
    }

    //create post data schema that accesses the entity.
    const hashedPassword = await bcrypt.hash(regdto.password, 10);
    const userEntity = this.userRepository.create({
      firstname: regdto.firstname,
      lastName: regdto.lastName,
      username: regdto.username,
      password: hashedPassword,
      email: regdto.email,
      dob: regdto.dob,
      isActive: false,
    });

    const newUser = await this.userRepository.save(userEntity);
    // check if you newUser is an object . 
    if (!newUser || typeof newUser !== 'object' || !newUser.password)
      throw new UnauthorizedException('user must be created');

    //return newuser without password 
    const { password, ...newuser } = newUser;
    return newuser;
  }

  // validateUser using UsersService to find user by username
  async validateUser(logindto: LoginDto) { // validate user details 
    const validUser = await this.usersService.findByUsername(logindto.username);

    // if user not found
    if (!validUser) throw new UnauthorizedException('Invalid user data');

    //compare password !
    const IsMatch = await bcrypt.compare(logindto.password, validUser.password);

    if (!IsMatch) {
      throw new UnauthorizedException('wrong password');
    }

    //hide password 
    const { password: _, ...User } = validUser;

    //generate sign in token 
    const payload = {
      sub: User.id,
      username: User.username,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { User, access_token };
  }

  // reset passwor method; 
  async forgotPassword( email: string){
    //check if user exit 
    const user = await this.userRepository.findOne({
      where: {email}
    })

    if(!user) throw new NotFoundException('User is not found ')

    const payload = {
      sub: user.id
    }

    const token = await this.jwtService.signAsync(payload)

    return {message: 'Reset link sent', token }

  }


  async resetPassword(token: string, newPassword: string){
    const payload = await this.jwtService.verifyAsync(token)
    const user = await this.userRepository.findOne({
      where: {id: payload.sub}
    })

    //validation 
    if(!user) throw new NotFoundException('Invalid token');
    //hash pass 
    user.password = await bcrypt.hash(newPassword, 10);

    await this.userRepository.save(user);
    return { 
      message: 'password reset successful'
    }
    
  }



}


// create function to recover account when user forget it pass.    


/* Add a “forgot password” flow:
Create endpoint: POST /api/auth/forgot-password.
Accept user email/username.
Generate reset token (JWT or UUID).
Email link: /api/auth/reset-password/:token.
Add POST /api/auth/reset-password to set new password.
Would you like me to show quick NestJS code for steps 1–2?  */

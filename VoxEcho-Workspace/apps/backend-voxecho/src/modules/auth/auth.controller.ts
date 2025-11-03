import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Request as ReqDecorator, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express'; // Good for type-only import (TS 4.5+)

// Extend Express Request type to include 'user'
declare module 'express' {
  export interface Request {
    user?: any;
  }
}

import { LoginDto } from '../dto/login.dto';
import { regDto } from '../dto/reg.dto';
import { AuthGuard } from './AuthJwt.strategy';
import { Public } from './public.decorator';


import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}
    
    @Public()
    @HttpCode(201)
    @Post('registration')
    async registration (@Body() regdto: regDto){

        if(!regdto ){
            throw new UnauthorizedException('fill registeration  details ')
        }

        const newUser = await this.authService.userRegistration(
            regdto
          );

        return newUser

    }
    
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() logindto: LoginDto){
        const user = await this.authService.validateUser(logindto)
        if(!user){
            throw new UnauthorizedException('user must be inputed')
        }

        return user
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string ){
        if(!email) throw new BadRequestException('Email required');
    
        return await this.authService.forgotPassword(email)
    }
   
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')    
    async resetPassword(@Body() body: {token: string; newpass: string }){
        return await this.authService.resetPassword(body.token, body.newpass)

    }


    // protect routing  with useGuard 
    @UseGuards(AuthGuard)  
    @Get('profile')
    getProfile(@ReqDecorator() req: Request){
        return req.user; //  return jwt user token, payload
    }
     
}

import { Body, Controller, Get, Post, Request as ReqDecorator, UnauthorizedException, UseGuards } from '@nestjs/common';

import type { Request } from 'express'; // Good for type-only import (TS 4.5+)
import { LoginDto } from '../dto/login.dto';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}
    @Post('login')
    async login(@Body() logindto: LoginDto){
        const user = await this.authService.validateUser(logindto.username, logindto.password);
        if(!user){
            throw new UnauthorizedException('invalid credential')
        }
        return {access_token: await this.authService.signToken(user)

        };

    }

    // protect routing  with useGuard 
    @UseGuards(AuthGuard('jwt'))  
    @Get('profile')
    getProfile(@ReqDecorator() req: Request){
        return req.user; //  return jwt payload 
    }

}

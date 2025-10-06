import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { CustomConfigService } from '../../config/config.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './AuthJwt.strategy';




@Module({
  imports: [  
    UsersModule,

    JwtModule.registerAsync({
      global: true,
      useFactory: (config: CustomConfigService)=>{
       const secret = config.jwtSecret; 
       if(!secret)
        throw new Error('Jwt isnt defined ');
    
       return {
        secret, 
        signOptions: {
          expiresIn:
          config.jwtTokenExp
        }
      }
      },
        inject: [CustomConfigService],
      }),

 
  ],
  providers: [ 
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
],
  controllers: [AuthController], 
  exports: [AuthService]
})
export class AuthModule { }
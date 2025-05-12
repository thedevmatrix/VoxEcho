import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt';

import { CustomConfigService } from '../../config/config.service';


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: CustomConfigService)=>({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: '60m',
        },
      }),
      inject: [CustomConfigService]
    })

  ],
  providers: [AuthService], // this register auth service as a provider 
  controllers: [AuthController], 

  exports: [AuthService]
})
export class AuthModule {}

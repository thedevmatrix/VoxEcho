import {  Module, MiddlewareConsumer, NestModule, Global,  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CorsMiddleware } from '../middleware/cor-middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../config/validation';
import { CustomConfigService } from '../config/config.service';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { DatabaseModule } from '../modules/database/database.module';
import { multerConfig } from '../middleware/Muterconfig.module';

import { IncidentsModule } from '../modules/incidents/incidents.module';
import * as path from "path";
@Global()
@Module({
 imports: [
  ConfigModule.forRoot({
    
envFilePath: [path.resolve(process.cwd(), '.env')],
    validate: (config) => {
      const parsed = envSchema.safeParse(config);
      if (!parsed.success) {
        throw new Error(
          `❌ Invalid environment variables: ${parsed.error.message}`
        );
      }
      return parsed.data;
    },
  }),

  DatabaseModule,
  AuthModule,
  UsersModule,
  IncidentsModule,
  multerConfig,

],

  controllers: [AppController],
  providers: [AppService, CustomConfigService],
  exports: [CustomConfigService]
})

//make my cor middle global 
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(rateLimit({
      windowMs: 15 * 60 *1000,
      max:100

    })).forRoutes('*')
    
  }

}

import {  Module, MiddlewareConsumer, NestModule,  } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from '../config/validation';
import { CorsMiddleware } from '../middleware/cor-middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`❌ Invalid environment variables: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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

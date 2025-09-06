import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from '../config/validation';
import { IncidentsModule } from '../modules/incidents/incidents.module';
import { CorsMiddleware } from '../middleware/cor-middleware';
import { CustomConfigService } from '../config/config.service';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validate(config: Record<string, unknown>) {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`❌ Invalid environment variables: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
    IncidentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomConfigService],
  exports: [CustomConfigService],
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

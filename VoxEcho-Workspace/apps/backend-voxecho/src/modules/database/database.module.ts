import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from '../../config/config.service';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: CustomConfigService) => ({
        type: 'postgres',  
        port: config.databasePort,
        username: config.databaseUsername,
        password: config.databasepass,
        database: config.dataBase,
        autoLoadEntities: true,
        synchronize: true, //false in production
      }),

    inject: [CustomConfigService],

    }),
  ],
})
export class DatabaseModule {
  constructor( private dataSource: DataSource ){}
}
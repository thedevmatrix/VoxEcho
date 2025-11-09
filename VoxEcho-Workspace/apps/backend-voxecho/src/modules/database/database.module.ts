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
        synchronize: config.nodeEnv !== 'production', // Only true in development
        // Connection pool settings
        pool: {
          min: 2,
          max: 10,
          idleTimeoutMillis: 30000,
          acquireTimeoutMillis: 20000,
        },
        // Query execution timeout
        extra: {
          statement_timeout: 10000, // 10 seconds
          connectionTimeoutMillis: 10000, // 10 seconds
        },
        // Retry connection settings
        retryAttempts: 3,
        retryDelay: 3000,
        // Connection timeout
        // connectTimeoutMS: 10000, // Removed: not supported for PostgreSQL
        keepConnectionAlive: true,
        ssl: config.nodeEnv === 'production',
      }),

    inject: [CustomConfigService],

    }),
  ],
})
export class DatabaseModule {
  constructor( private dataSource: DataSource ){}
}
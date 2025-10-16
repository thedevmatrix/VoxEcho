// location.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocationService } from './location.service';

@Module({
  imports: [HttpModule],
  providers: [LocationService],
  exports: [LocationService, HttpModule],
})
export class LocationModule {}

import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [],
  controllers: [IncidentsController],
  providers: [IncidentsService, PrismaService],
  exports: [IncidentsService]
})
export class IncidentsModule {}

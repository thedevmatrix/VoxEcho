import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIncidentDto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        title: createIncidentDto.title,
        description: createIncidentDto.description,
        media: createIncidentDto.media || [],
        tags: createIncidentDto.tags || [],
        location: createIncidentDto.location,
      },
    });
  }

  async findAll() {
    return this.prisma.incident.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.incident.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.incident.delete({
      where: { id },
    });
  }
}

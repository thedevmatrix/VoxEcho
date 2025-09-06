import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIncidentDto: CreateIncidentDto) {
    // Transform and validate the DTO
    const incident = plainToInstance(CreateIncidentDto, createIncidentDto);
    await validateOrReject(incident);

    return this.prisma.incident.create({
      data: {
        title: incident.title,
        description: incident.description,
        media: incident.media || [],
        tags: incident.tags || [],
        location: {
          latitude: incident.location.latitude,
          longitude: incident.location.longitude
        },
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
    const incident = await this.prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  async delete(id: string) {
    await this.findOne(id); // Check if exists first
    return this.prisma.incident.delete({
      where: { id },
    });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { NotFoundException } from '@nestjs/common';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
// import { PrismaClient } from '@prisma/client';

// type MockPrismaService = {
//   [K in keyof PrismaClient]: jest.Mocked<PrismaClient[K]>;
// };

// type Incident = {
//   id: string;
//   title: string;
//   description: string;
//   media: string[];
//   tags: string[];
//   location: {
//     latitude: number;
//     longitude: number;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// };

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createIncidentDto: CreateIncidentDto = {
      title: 'Test Incident',
      description: 'Test Description',
      media: ['http://example.com/image.jpg'],
      tags: ['test', 'incident'],
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
    };

    const mockCreatedIncident = {
      id: '1',
      title: 'Test Incident',
      description: 'Test Description',
      media: ['http://example.com/image.jpg'],
      tags: ['test', 'incident'],
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create an incident successfully', async () => {
      mockPrismaService.incident.create.mockResolvedValue(mockCreatedIncident);

      const result = await service.create(createIncidentDto);

      expect(result).toEqual(mockCreatedIncident);
      expect(mockPrismaService.incident.create).toHaveBeenCalledWith({
        data: {
          title: createIncidentDto.title,
          description: createIncidentDto.description,
          media: createIncidentDto.media,
          tags: createIncidentDto.tags,
          location: {
            latitude: createIncidentDto.location.latitude,
            longitude: createIncidentDto.location.longitude,
          },
        },
      });
    });
  });

  describe('findAll', () => {
    const mockIncidents = [
      {
        id: '1',
        title: 'Incident 1',
        description: 'Description 1',
        media: [],
        tags: ['test'],
        location: { latitude: 40.7128, longitude: -74.0060 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Incident 2',
        description: 'Description 2',
        media: [],
        tags: ['test'],
        location: { latitude: 40.7128, longitude: -74.0060 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all incidents', async () => {
      mockPrismaService.incident.findMany.mockResolvedValue(mockIncidents);

      const result = await service.findAll();

      expect(result).toEqual(mockIncidents);
      expect(mockPrismaService.incident.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    const mockIncident = {
      id: '1',
      title: 'Test Incident',
      description: 'Test Description',
      media: [],
      tags: ['test'],
      location: { latitude: 40.7128, longitude: -74.0060 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return an incident by id', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.findOne('1');

      expect(result).toEqual(mockIncident);
      expect(mockPrismaService.incident.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when incident is not found', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const mockIncident = {
      id: '1',
      title: 'Test Incident',
      description: 'Test Description',
      media: [],
      tags: ['test'],
      location: { latitude: 40.7128, longitude: -74.0060 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should delete an incident successfully', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrismaService.incident.delete.mockResolvedValue(mockIncident);

      const result = await service.delete('1');

      expect(result).toEqual(mockIncident);
      expect(mockPrismaService.incident.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when trying to delete non-existent incident', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.incident.delete).not.toHaveBeenCalled();
    });
  });
});

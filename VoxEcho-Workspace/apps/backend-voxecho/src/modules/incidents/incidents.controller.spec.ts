import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('IncidentsController', () => {
  let controller: IncidentsController;

  const mockIncidentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  } as unknown as jest.Mocked<IncidentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
          useValue: mockIncidentsService,
        },
      ],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      title: createIncidentDto.title,
      description: createIncidentDto.description,
      media: createIncidentDto.media ?? [],
      tags: createIncidentDto.tags ?? [],
      location: {
        latitude: createIncidentDto.location.latitude,
        longitude: createIncidentDto.location.longitude,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create an incident', async () => {
      mockIncidentsService.create.mockResolvedValue(mockCreatedIncident);

      const result = await controller.create(createIncidentDto);

      expect(result).toEqual(mockCreatedIncident);
      expect(mockIncidentsService.create).toHaveBeenCalledWith(createIncidentDto);
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
    ];

    it('should return an array of incidents', async () => {
      mockIncidentsService.findAll.mockResolvedValue(mockIncidents);

      const result = await controller.findAll();

      expect(result).toEqual(mockIncidents);
      expect(mockIncidentsService.findAll).toHaveBeenCalled();
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

    it('should return a single incident', async () => {
      mockIncidentsService.findOne.mockResolvedValue(mockIncident);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockIncident);
      expect(mockIncidentsService.findOne).toHaveBeenCalledWith('1');
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

    it('should delete an incident', async () => {
      mockIncidentsService.delete.mockResolvedValue(mockIncident);

      const result = await controller.delete('1');

      expect(result).toEqual(mockIncident);
      expect(mockIncidentsService.delete).toHaveBeenCalledWith('1');
    });
  });
});

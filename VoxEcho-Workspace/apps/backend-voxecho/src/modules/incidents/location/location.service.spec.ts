// location.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('LocationService', () => {
  let service: LocationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return location data from API', async () => {
    const mockResponse: AxiosResponse = {
      data: 
      { 
        display_name: 
        'Lagos, Nigeria'
       },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as any
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getPlaceFromCoords(6.5244, 3.3792);
    expect(result.placeName
    ).toBe('Lagos, Nigeria');
  });

  it('should handle API errors gracefully', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('API Error')));
    await expect(service.getPlaceFromCoords(0, 0)).rejects.toThrow('API Error');
  });
});

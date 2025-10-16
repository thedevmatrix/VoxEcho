// location.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocationService {
  constructor(private readonly http: HttpService) {}

  async getPlaceFromCoords(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await firstValueFrom(this.http.get(url));
    return {
      placeName: response.data.display_name,
      placeId: response.data.place_id,
    };
  }
}

import { IsString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class LocationDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  latitude: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  longitude: number;

  constructor() {
    this.latitude = 0;
    this.longitude = 0;
  }
}

export class CreateIncidentDto {
  @IsString()
  title: string = '';

  @IsString()
  description: string = '';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => value || [])
  media?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => value || [])
  tags?: string[] = [];

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto = new LocationDto();
}

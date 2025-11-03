import {  IsString, IsDate, ValidateNested, ArrayMinSize, IsNumber, IsOptional, IsNotEmpty} from "class-validator";

import { Type } from 'class-transformer';
import { LocationDto } from "./location.dto"; 

export class createIncidentDto{
    @IsNumber()
    id?: number

    @IsString()
    title!: string

    @IsNotEmpty()
    @IsString()
    content!: string

    @IsOptional()
    @IsString()
    file!: string

    @IsOptional()
    @ValidateNested({ }) // check as true to validate everything in our loop 
    @Type(() => LocationDto) //loop generator 
    @ArrayMinSize(1)
    location !: LocationDto[]


    @Type(() => Date)
    @IsDate()
    createdAt !: Date;

    @Type(() => Date)
    @IsDate()
    updatedAt!: Date 


}


import { IsString, IsNumber } from "class-validator";



export class LocationDto{
   
    @IsString()
    placeName!: string 

    @IsString()
    placeId !: string  
        
    @IsNumber()
    latitude!: number
        
    @IsNumber()
    longitude!: number 

   
}
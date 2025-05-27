import { IsString, IsNotEmpty, IsInt } from 'class-validator';


export class LoginDto{
    @IsInt()
    @IsNotEmpty()
    id!: number

    @IsString()
    @IsNotEmpty()
    username!: string ;


    @IsString()
    @IsNotEmpty()
    password!: string ;
}
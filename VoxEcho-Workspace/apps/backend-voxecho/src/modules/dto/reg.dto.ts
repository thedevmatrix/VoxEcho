import {  IsInt, Length,   IsEmail , IsNotEmpty, Matches } from "class-validator"

export class regDto{

    @IsNotEmpty()
    @Length(1, 20)
    name !:string

    @IsNotEmpty()
    @Length(1, 20)
    lastName !: string 

    @IsNotEmpty()
    @Length(1, 20)
    username !: string


    @IsNotEmpty()
    @Length(9, 20)
    password !: string



    @IsNotEmpty()
    @Length(9, 20)
    comfirmPass !: string

    @IsNotEmpty()
    @IsEmail()
    Email!: string

    @IsNotEmpty()
    @Matches(/^\d{1,2}$/, {message: 'Day must be a number between 1-31'})
    day!: number 

    @IsInt()
    @IsNotEmpty()
    month!: number 
    @Matches(/^\d{1,2}$/, {message: 'month must be a number between 1-12'})

    @IsInt()
    @IsNotEmpty()
    @Matches(/^\d{4}$/, {message: 'Day must be a number between 1-31'})
    year!: number




}

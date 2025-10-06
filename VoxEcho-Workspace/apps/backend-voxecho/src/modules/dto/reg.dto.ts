import {  Length,   IsEmail , IsNotEmpty } from "class-validator"

export class regDto{

    @IsNotEmpty()
    @Length(1, 20)
    firstname !:string

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
    email!: string

    @IsNotEmpty()
    dob!: Date
  name: string
  Email: string
  day: number
  month: number
  year: number

}

import { IsNotEmpty } from "class-validator";


export class updateUserDto {
    @IsNotEmpty()
    image !: string;  

    @IsNotEmpty()
    bio !: string


}
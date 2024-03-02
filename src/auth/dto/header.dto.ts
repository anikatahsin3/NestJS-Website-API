import { IsNotEmpty, IsString } from "class-validator";

export class HeaderDto{
    @IsNotEmpty()
    @IsString()
    authorization: string
}
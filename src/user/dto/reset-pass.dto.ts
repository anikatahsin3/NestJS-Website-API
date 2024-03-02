import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf} from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    new_password: string;
  
}
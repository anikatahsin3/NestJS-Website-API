import { Transform } from "class-transformer";
import { IsEmail, IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, Validate, ValidateBy, ValidateIf } from "class-validator";
import { userInfo } from "os";
import { IsNull } from "typeorm";

export class FilterUserDto {
    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    // @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    designation: string

    @Transform(({value}) => parseInt(value))
    @IsOptional()
    @IsInt()
    role_id: number

}
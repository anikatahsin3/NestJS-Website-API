import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf} from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    designation: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsInt()
    employee_id: number

}
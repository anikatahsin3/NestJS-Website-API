import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class UserRoleDto {
    @Min(0)
    @Max(2)

    @IsNotEmpty()
    @Transform(({value}) => parseInt(value))
    role: number
}
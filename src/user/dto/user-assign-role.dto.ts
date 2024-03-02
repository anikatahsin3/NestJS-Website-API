import { Transform } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class UserAssignRoleDto {

    @IsNotEmpty()
    @Transform(({value}) => parseInt(value))
    role_id: number
    
    @IsNotEmpty()
    @IsArray()
    @Transform(({value}) => (value.map((v: string) => parseInt(v))))
    @IsNumber({ allowNaN: false }, { each: true })
    @ArrayMinSize(1)
    permission_groups_id: number[];

}
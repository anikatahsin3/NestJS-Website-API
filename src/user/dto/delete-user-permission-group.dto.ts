import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty } from "class-validator";

export class PermissionGroupDeleteDto{
   
    @Transform(({value}) => parseInt(value))
    @IsNotEmpty()
    permission_group_id: number;
}
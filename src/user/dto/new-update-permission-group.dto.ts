import { Transform } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class PermissionGroupListDto{
   
    @IsArray()
    @Transform(({value}) => (value.map((v: string) => parseInt(v))))
    @IsNumber({ allowNaN: false }, { each: true })
    @ArrayMinSize(1)
    permission_groups_id: number[];
}
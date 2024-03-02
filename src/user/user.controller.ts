import {Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, Query,} from "@nestjs/common";
import {CreateUserDto} from "./dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FilterUserDto} from "./dto/validate-user.dto";
import {UserService} from "./user.service";
import {jwtConstants} from "../auth/auth.constant";
import {JwtService} from "@nestjs/jwt";
import {USER_CONSTANTS} from "./user.constants";
import {AuthService} from "../auth/auth.service";
import {HeaderDto} from "../auth/dto/header.dto";
import {ResetPasswordDto} from "./dto/reset-pass.dto";

@Controller("users")
export class UserController {
	constructor(
		private readonly userService: UserService,

		private jwtService: JwtService,
		private authService: AuthService
	) {}

    @HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() createUserDto: CreateUserDto, @Headers() header: HeaderDto) {
		await this.authService.authorize("create-users-permission", header);
		const accessorId = header.authorization
			? this.jwtService.verify(header.authorization.split(" ")[1], jwtConstants).sub
			: USER_CONSTANTS.USER_TYPE.SOFTWARE_ADMIN;
        const user = await this.userService.create(createUserDto, accessorId);
        await this.userService.updatePermissionGroup(user.id);

        console.log(accessorId);

        const response={
            message:'Succesfully created an user'
        }
        return response
	}

    @HttpCode(HttpStatus.OK)
    @Put(':id/new-password')
    async updatePassword(@Param("id") id: number, @Body() body: ResetPasswordDto, @Headers() header: HeaderDto){
        const userId = await this.authService.authorize("update-user-password-permission", header);
        
        
        if(userId==id){
             await this.userService.updatePassword(id,body,userId)
            const response={
                message:"Successfully changed password"   
            }
            return response
        }
        else{
            const otherUserId = await this.authService.authorize("update-user-password-permission", header);
            await this.userService.updatePassword(id,body,otherUserId)
            const response={
                message:"Successfully changed password"   
            }
            return response
        }

    }

    @HttpCode(HttpStatus.CREATED)
    @Post(':id/new-password-request')
    async getNewPassword(@Param("id") id: number,@Body() body: ResetPasswordDto, @Headers() header: HeaderDto){
		await this.authService.authorize("update-user-password-permission", header);
		const data =  await this.userService.getNewPassword(body,id)
		const response={
            data:data,
            message:"Successfully generated results"

        }
        return response
    }

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll(@Query() query: FilterUserDto, @Headers() header: HeaderDto) {
		await this.authService.authorize("get-all-users-permission", header);

		return this.userService.findAll(query);
	}

    @HttpCode(HttpStatus.OK)
	@Get(":id")
	async getOne(@Param("id") id: string, @Headers() header: HeaderDto) {
		await this.authService.authorize("get-one-user-permission", header);

		return this.userService.findOne(+id);
	}

    @HttpCode(HttpStatus.OK)
	@Get(":id/permission-list")
	async findPermissionList(@Param("id") id: string, @Headers() header: HeaderDto) {
		await this.authService.authorize("get-permission-list-permission", header);

		return this.userService.findPermissionList(+id);
	}

    @HttpCode(HttpStatus.OK)
	@Put(":id")
	async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @Headers() header: HeaderDto) {
		const userId = await this.authService.authorize("update-user-permission", header);

		return this.userService.update(+id, updateUserDto, userId);
	}

    @HttpCode(HttpStatus.OK)
	@Delete(":id")
	async remove(@Param("id") id: string, @Headers() header: HeaderDto) {
		await this.authService.authorize("delete-users-permission", header);
		const decoded = this.jwtService.verify(header.authorization.split(" ")[1], jwtConstants);
		return this.userService.remove(+id, decoded);
	}
}
import { Injectable, NotAcceptableException, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { CreateUserDto } from "./dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { TypeOrmQueryService } from "@nestjs-query/query-typeorm";
import { FilterUserDto } from "./dto/validate-user.dto";
import { USER_CONSTANTS } from "./user.constants";
import { ResetPasswordDto } from "./dto/reset-pass.dto";

@Injectable()
export class UserService extends TypeOrmQueryService<User> {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    //private permissionGroupService:PermissionGroupService
    ) {
		super(userRepository, { useSoftDelete: true });
	}

	async create(createUserDto: CreateUserDto, accessorId: number) {
		const salt = await bcrypt.genSalt(10);
		createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
            const user = await this.userRepository.create(createUserDto)
		return await this.userRepository.save(user);
	}

	async findAll(@Query() query: FilterUserDto) {
		const userQueryBuilder = this.userRepository.createQueryBuilder("users");
		userQueryBuilder.select([
            "users.id",
            "users.name",
            "users.email",
            "users.phone",
            "users.address",
            "users.employee_id",
        ]);

		if (query.email) {
			userQueryBuilder.andWhere("users.email like :email", { email: `%${query.email}%` });
		}
		if (query.name) {
			userQueryBuilder.andWhere("users.name like :name", { name: `%${query.name}%` });
		}
		const users = userQueryBuilder.getRawMany();

		return users;
	}

    async getNewPassword(query:ResetPasswordDto,userId:number){
        const user = await this.userRepository.createQueryBuilder('user')
        .select('user.password')
        .andWhere("user.id = :id", { id: userId });
        const userList = await user.getOne()       
        const current_pass = userList.password       
        const newPassword = query.new_password
        const salt = await bcrypt.genSalt(10);
        const new_password = await bcrypt.hash(newPassword, salt);
        const match = await bcrypt.compare(newPassword, current_pass);  
        console.log(match);
        if(match==true){
            return 'password matched'
        }
        else{
            throw new NotAcceptableException("password did not match with old password");
        }       
    }
    // async getNewPassword(query:ResetPasswordDto,userId:number){
    //     const user = await this.userRepository.createQueryBuilder('user')
    //     .select('user.password')
    //     .andWhere("user.id = :id", { id: userId });
    //     const userList = await user.getOne()       
    //     const current_pass = userList.password       
    //     const newPassword = query.new_password
    //     const salt = await bcrypt.genSalt(10);
    //     const new_password = await bcrypt.hash(newPassword, salt);
    //     const match = await bcrypt.compare(newPassword, current_pass);  
    //     console.log(match);
    //     if(match==true){
    //         return 'password matched'
    //     }
    //     else{
    //         return 'password did not match with old password'
    //     }       
    // }


    async updatePassword(id:number, body:ResetPasswordDto, userId:number){
        const user = await this.userRepository.createQueryBuilder('user')
        .select('user.password')
        .andWhere("user.id = :id", { id: id })
        .getOne();
        console.log(user);
        
        const salt = await bcrypt.genSalt(10);
        const new_password = await bcrypt.hash(body.new_password, salt);
        user.password = new_password;
        return await this.userRepository.update(id, user);


    }

	async findOne(id: number) {
		return this.userRepository
			.createQueryBuilder("users")
			.select([
                "users.id", 
                "users.name", 
                "users.email", 
                "users.phone", 
                "users.address",
            ])
			.where("users.id = :id", { id: id })
			.getOneOrFail();
	}

	findByEmail(email: string) {
        return this.userRepository
			.createQueryBuilder("users")
			.select([
                "users.id", 
                "users.name", 
                "users.email", 
                "users.password", 
                "users.phone", 
                "users.address"
            ])
			.andWhere("users.email like :email", { email: `%${email}%` })
			.getOneOrFail();
	}

	async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
		const user = await this.userRepository.createQueryBuilder("users").update("users").where("users.id = :id", { id: id });
		user.set({ updated_by: userId, ...updateUserDto });
		return user.execute();
	}

     async updatePermissionGroup( id: number) {
	 	const user = await this.findOne(id);
	 	const response = {
	 		data: await this.userRepository.save(user),
	 		message: "Sucessfully updated data of user permission group",
	 	};
	 	return response;
	 }
    

	async remove(id: number, decodedJson) {
		const voucher = await this.userRepository.createQueryBuilder("users").where("users.id = :id", { id: id }).getOne();
		voucher.updated_by = decodedJson.sub;
		let voucherPromise = await this.userRepository.save(voucher);
		return voucherPromise.softRemove();
	}
}

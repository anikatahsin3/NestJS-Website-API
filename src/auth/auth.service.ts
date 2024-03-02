import { Headers, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "./auth.constant";
import { USER_CONSTANTS } from '../user/user.constants';
import { User } from '../user/entities/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {
    }


    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        const match = await bcrypt.compare(password, user.password);
        console.log(user.password);
        console.log(password);
        
        
        if (user && match) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id };
        const permissions = await this.userService.findPermissionList(user.id)
        return {
            user_id: user.id,
            name: user.name,
            role_id: user.userRole ? user.userRole.id : null,
            permission_list: [...permissions],
            access_token: this.jwtService.sign(payload)
        }
    }

    async authorize(permission: string, @Headers() header: { authorization: string } ) {
        if(header.authorization == null){
            throw new UnauthorizedException("Token is missing")
        }
        const decoded = this.jwtService.verify(header.authorization.split(' ')[1], jwtConstants);
        

        const user: User = await this.userService.findOne(decoded.sub);
            
        const permissions = await this.userService.findPermissionList(decoded.sub);
        
        if (permissions.includes(permission)) {
            return user.id;
        } else {
            throw new UnauthorizedException("User doesn't have required permission!");
        }
    }

}
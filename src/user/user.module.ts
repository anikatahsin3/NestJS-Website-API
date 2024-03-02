import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";

@Module({
    controllers: [UserController],
    providers: [UserService, JwtAuthGuard, AuthService, JwtService],
    exports: [UserService, UserModule],
    imports: [
        TypeOrmModule.forFeature([User]),
    ]
})
export class UserModule {
}

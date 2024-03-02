import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {jwtConstants} from './auth.constant';

import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';
import {LocalStrategy} from './local.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService, 
        LocalStrategy, 
        JwtStrategy,
        UserService,
    ],
    imports: [
        //UserModule,
        TypeOrmModule.forFeature([
            User,
        ]),

        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '24h'},
        }),],
    exports: [AuthModule, AuthService]
})
export class AuthModule {
}

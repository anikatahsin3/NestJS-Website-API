import { Body, Controller, Post, UseGuards, Request, NotAcceptableException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req: any){
        return this.authService.login(req.user);
    }
}

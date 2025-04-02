import { Body, Controller, Post } from '@nestjs/common';
import { LoginBodyDto, LoginResDto, LogoutResDto, RefreshTokenDto, RefreshTokenResDto, RegisterBodyDto, RegisterResDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: RegisterBodyDto) {
        return new RegisterResDto(await this.authService.register(body))
    }

    @Post('login')
    async login(@Body() body: LoginBodyDto) {
        return new LoginResDto(await this.authService.login(body))
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: RefreshTokenDto) {
        return new RefreshTokenResDto(await this.authService.refreshToken(body.refreshToken))
    }

    @Post('logout')
    async logout(@Body() body: RefreshTokenDto) {
        return new LogoutResDto(await this.authService.logout(body.refreshToken))
    }
}

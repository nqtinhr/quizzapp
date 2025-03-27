import { Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterResponseDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @SerializeOptions({ type: RegisterResponseDto })
    @Post('register')
    register() {
        return 'register';
    }
}

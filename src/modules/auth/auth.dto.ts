import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    name: string;
    @IsString()
    comfirmPassword: string;
}

export class RegisterResponseDto {
    id: string;
    name: string;
    email: string;
    @Exclude() password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<RegisterResponseDto>) {
        Object.assign(this, partial);
    }
}
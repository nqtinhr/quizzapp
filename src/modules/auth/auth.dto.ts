import { Exclude } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginBodyDto {
    @IsEmail()
    email: string;
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
}

export class RegisterBodyDto extends LoginBodyDto {
    @IsString()
    name: string;
    @IsString()
    comfirmPassword: string;
}

export class RegisterResDto {
    id: string;
    name: string;
    email: string;
    @Exclude() password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<RegisterResDto>) {
        Object.assign(this, partial);
    }
}

export class LoginResDto {
    accessToken: string;
    refreshToken: string;

    constructor(partial: Partial<LoginResDto>) {
        Object.assign(this, partial);
    }
}

export class RefreshTokenDto {
    refreshToken: string;
}

export class RefreshTokenResDto extends LoginResDto {}
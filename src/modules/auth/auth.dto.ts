import { Exclude } from 'class-transformer'
import { IsEmail, IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDto {
  @IsEmail()
  email: string
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string
}

export class LoginResDto {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDto>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString()
  name: string
  @IsString()
  @Match('password', { message: 'Passwords must match' })
  comfirmPassword: string
}

export class RefreshTokenDto {
  refreshToken: string
}

export class RegisterResDto {
  id: string
  name: string
  email: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterResDto>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenResDto extends LoginResDto {}

export class LogoutBodyDto extends RefreshTokenDto {}

export class LogoutResDto {
  message: string

  constructor(partial: Partial<LogoutResDto>) {
    Object.assign(this, partial)
  }
}

import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import {
  LoginBodyDto,
  LoginResDto,
  LogoutResDto,
  RefreshTokenDto,
  RefreshTokenResDto,
  RegisterBodyDto,
  RegisterResDto
} from './auth.dto'
import ms from 'ms'
import { Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    return new RegisterResDto(await this.authService.register(body))
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBodyDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body)
    /**
     * Xử lý trường hợp trả về http only cookie cho phía trình duyệt
     * Về cái maxAge và thư viện ms: https://expressjs.com/en/api.html
     * Đối với cái maxAge – thời gian sống của Cookie thì chúng ta sẽ để tối đa 1 ngày, tùy dự án. Lưu ý thời gian sống của cookie khác với cái thời gian sống của token nhé
     */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days')
    })
    return new LoginResDto({ accessToken, refreshToken })
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(body.refreshToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('1 days')
    })

    return new RefreshTokenResDto({ accessToken, refreshToken })
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return new LogoutResDto(await this.authService.logout(body.refreshToken))
  }
}

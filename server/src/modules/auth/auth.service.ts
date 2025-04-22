import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import { isNotFoundError, isUniqueConstraintPrismaError } from 'src/shared/helper'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name
        }
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
      throw new UnauthorizedException()
    }
  }

  async login(body: LoginBodyDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (!user) {
      throw new UnauthorizedException('Account is not exists')
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect'
        }
      ])
    }
    const tokens = await this.generateTokens({ userId: user.id, role: user.role })
    return tokens
  }

  async refreshToken(refreshToken: string) {
    try {
      // Kiểm tra refresh token có hợp lệ hay không
      const { userId, role } = await this.tokenService.verifyRefreshToken(refreshToken)
      // Kiểm tra refresh token có tồn tại trong database hay không
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken
        }
      })
      // Xóa refresh token cũ
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
      return this.generateTokens({ userId, role })
    } catch (error) {
      // Trường hợp đã refesh token rồi, hãy thông báo cho user biết refresh token đã bị đánh cắp
      if (isNotFoundError(error)) {
        throw new HttpException('Refresh token has been revoked', HttpStatus.FORBIDDEN)
      }
      // Token không hợp lệ hoặc lỗi khác
      throw new HttpException('Invalid refresh token', 498)
    }
  }

  async logout(refreshToken: string) {
    try {
      // await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw new UnauthorizedException()
      }
    }
    return { message: 'Logout successfully' }
  }

  private async generateTokens(payload: { userId: string; role: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload)
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000)
      }
    })
    return { accessToken, refreshToken }
  }
}

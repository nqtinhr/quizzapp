import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'
import { Prisma } from '@prisma/client'
import { TokenService } from 'src/shared/services/token.service'

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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
      throw new UnauthorizedException();
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
    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async refreshToken(refreshToken: string) {
    try {
      // Kiểm tra refresh token có hợp lệ hay không
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
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
      // Tạo access token và refresh token mới
      const tokens = await this.generateTokens({ userId })
      return tokens
    } catch (error) {
      // Trường hợp đã refesh token rồi, hãy thông báo cho user biết refresh token đã bị đánh cắp
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens(payload: { userId: string }) {
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

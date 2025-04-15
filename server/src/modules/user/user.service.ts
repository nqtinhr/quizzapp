import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    return user
  }
}

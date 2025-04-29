import { Injectable } from '@nestjs/common'
import { PaginationQueryDto } from 'src/shared/models/paging.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    return user
  }

  async getAllUsers(query: PaginationQueryDto) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const search = query.search?.toLowerCase()

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search} }
          ]
        }
      : {}

    const [users, totalRows] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.user.count({ where })
    ])

    return {
      data: users,
      pagination: {
        page,
        limit,
        totalRows
      }
    }
  }
}

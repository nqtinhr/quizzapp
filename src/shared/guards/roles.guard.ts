import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user || !user.userId) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    // Fetch user role from database
    const userRecord = await this.prismaService.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    })

    if (!userRecord || !requiredRoles.includes(userRecord.role)) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    return true
  }
}

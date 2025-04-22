import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/client'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenPayload } from '../types/jwt.type'

/**
 * Group Roles & Hierarchical RBAC
 * Group Roles: Một user có thể có nhiều vai trò (roles),
 * Hierarchical RBAC: Vai trò có thể kế thừa lại từ vai trò khác.
 * CRUD (Create, Read, Update, Delete)
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const user: TokenPayload = request[REQUEST_USER_KEY]
    if (!requiredRoles.includes(user?.role as UserRole)) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }
    return true
  }
}

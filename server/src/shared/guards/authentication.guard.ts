import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthType, ConditionGuard } from '../constants/auth.constant'
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from '../decorators/auth.decorator'
import { AccessTokenGuard } from './access-token.guard'
import { APIKeyGuard } from './api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.APIKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true }
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValues = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } }
    const guards = authTypeValues.authTypes.map((authType) => this.authTypeGuardMap[authType])

    if (authTypeValues.options.condition === ConditionGuard.Or) {
      for (const instance of guards) {
        try {
          const canActivate = await instance.canActivate(context)
          if (canActivate) return true
        } catch (err) {
          const response = context.switchToHttp().getResponse()

          // Nếu lỗi là 410 => set header để tránh cache
          if (err instanceof HttpException) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            if (err.getStatus() === HttpStatus.GONE) {
              response.setHeader('Cache-Control', 'no-store')
              throw err
            }
          }
        }
      }
      throw new UnauthorizedException()
    } else {
      for (const instance of guards) {
        try {
          const canActivate = await instance.canActivate(context)
          if (!canActivate) return false
        } catch (err) {
          if (err instanceof HttpException) {
            throw err
          } else {
            throw new UnauthorizedException()
          }
        }
      }
      return true
    }
  }
}

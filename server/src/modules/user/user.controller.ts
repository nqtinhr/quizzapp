import { Controller, Get } from '@nestjs/common'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { UserService } from './user.service'
import { ProfileResDto } from './user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('profile')
  async getProfile(@ActiveUser('userId') userId: string) {
    return new ProfileResDto(await this.userService.getProfile(userId))
  }
}

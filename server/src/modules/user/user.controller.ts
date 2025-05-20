import { Controller, Get, Query } from '@nestjs/common'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { UserService } from './user.service'
import { GetAllUsersResDto, ProfileResDto } from './user.dto'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { PaginationDto, PaginationQueryDto } from 'src/shared/models/paging.model'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('profile')
  async getProfile(@ActiveUser('userId') userId: string) {
    return new ProfileResDto(await this.userService.getProfile(userId))
  }

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get()
  async getAllUsers(@Query() query: PaginationQueryDto) {
    const { data, pagination } = await this.userService.getAllUsers(query)
    return new GetAllUsersResDto(data, new PaginationDto(pagination))
  }
}

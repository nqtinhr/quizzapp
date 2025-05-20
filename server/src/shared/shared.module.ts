import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { HashingService } from './services/hashing.service'
import { PrismaService } from './services/prisma.service'
import { TokenService } from './services/token.service'
import { RolesGuard } from './guards/roles.guard'

const shareServices = [PrismaService, HashingService, TokenService]

@Global()
@Module({
  providers: [
    ...shareServices,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: shareServices,
  imports: [JwtModule]
})
export class SharedModule {}

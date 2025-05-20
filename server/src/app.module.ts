import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { QuizModule } from './modules/quiz/quiz.module'
import { UserModule } from './modules/user/user.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [SharedModule, AuthModule, QuizModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
  ]
})
export class AppModule {}

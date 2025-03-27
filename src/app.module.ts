import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [SharedModule, AuthModule, QuizModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

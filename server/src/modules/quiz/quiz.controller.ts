import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Quiz, UserRole } from '@prisma/client'
import * as fs from 'fs'
import { Multer } from 'multer'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { PaginationDto, PaginationQueryDto } from 'src/shared/models/paging.model'
import { CreateQuizDto, GetAllQuizzesResDto, GetQuizItemResDto, PlayQuizDto, PlayQuizResDto } from './quiz.dto'
import { QuizService } from './quiz.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('quizes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuizes(@Query() query: PaginationQueryDto): Promise<GetAllQuizzesResDto> {
    const { data, pagination } = await this.quizService.getQuizes(query)
    return new GetAllQuizzesResDto(data, new PaginationDto(pagination))
  }

  @Get(':id')
  async getQuizById(@Param('id') id: string): Promise<GetQuizItemResDto> {
    return new GetQuizItemResDto(await this.quizService.getQuizById(id))
  }

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Post()
  async createQuiz(@Body() body: CreateQuizDto): Promise<GetQuizItemResDto> {
    return new GetQuizItemResDto(await this.quizService.createQuiz(body))
  }

  @Roles(UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Patch(':id')
  async updateQuiz(@Param('id') id: string, @Body() quizData: any): Promise<Quiz> {
    return this.quizService.updateQuiz(id, quizData)
  }

  @Roles(UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Delete(':id')
  async deleteQuiz(@Param('id') id: string): Promise<boolean> {
    return this.quizService.deleteQuiz(id)
  }

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Post(':id/plays')
  async playQuiz(@Param('id') id: string, @ActiveUser('userId') userId: string, @Body() body: PlayQuizDto) {
    return new PlayQuizResDto(await this.quizService.playQuiz(id, userId, body.correctQuestionsNumber))
  }

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('history/plays')
  async getQuizPlays(@ActiveUser('userId') userId: string) {
    return await this.quizService.getQuizPlays(userId)
  }

  // @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  // @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  // @Get('export')
  // async exportQuizzes(@Res() res: Response) {
  //   const quizzes = await this.quizService.getQuizes()
  //   res.setHeader('Content-Disposition', 'attachment; filename=quizzes.json')
  //   res.json(quizzes)
  // }

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importQuizzes(@UploadedFile() file: Multer.File): Promise<void> {
    const data: CreateQuizDto[] = JSON.parse(fs.readFileSync(file.path, 'utf8'))
    // 1. Xóa tất cả các quiz có title trong danh sách import
    const titles = data.map((quiz) => quiz.title)
    await this.quizService.deleteByTitles(titles)

    // 2. Thêm danh sách quiz mới vào database
    // await this.quizService.createMultiple(data)
  }
}

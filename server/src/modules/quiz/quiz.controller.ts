import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserRole } from '@prisma/client'
import { Response } from 'express'
import * as fs from 'fs'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { PaginationDto, PaginationQueryDto } from 'src/shared/models/paging.model'
import {
  CreateQuizDto,
  GetAllPlayQuizzesResDto,
  GetAllQuizzesResDto,
  GetQuizItemResDto,
  PlayQuizDto,
  PlayQuizResDto,
  UpdateQuizDto
} from './quiz.dto'
import { QuizService } from './quiz.service'

@Controller('quizzes')
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
  async updateQuiz(@Param('id') id: string, @Body() quizData: UpdateQuizDto): Promise<GetQuizItemResDto> {
    return new GetQuizItemResDto(await this.quizService.updateQuiz(id, quizData))
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

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('history/all')
  async historyAllQuizPlays(@Query() query: PaginationQueryDto) {
    const { data, pagination } = await this.quizService.historyAllQuizPlays(query)
    return new GetAllPlayQuizzesResDto(data, new PaginationDto(pagination))
  }

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('history/plays')
  async historyQuizPlays(@ActiveUser('userId') userId: string, @Query() query: PaginationQueryDto) {
    const { data, pagination } = await this.quizService.historyQuizPlays(userId, query)
    return new GetAllPlayQuizzesResDto(data, new PaginationDto(pagination))
  }

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`)
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/json') {
          return cb(new Error('Only JSON files are allowed!'), false)
        }
        cb(null, true)
      }
    })
  )
  async importQuizzes(@UploadedFile() file: Express.Multer.File): Promise<number> {
    const content = fs.readFileSync(file.path, 'utf8')
    const data: CreateQuizDto[] = JSON.parse(content)
    return await this.quizService.importQuizzes(data)
  }

  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get('export/all')
  async exportQuizzes(@Res() res: Response) {
    const quizzes = await this.quizService.exportQuizzes()

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename=quizzes.json')
    res.send(JSON.stringify(quizzes, null, 2))
  }
}

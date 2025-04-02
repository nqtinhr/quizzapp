import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Quiz } from '@prisma/client'
import { Response } from 'express'
import * as fs from 'fs'
import { Multer } from 'multer'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { CreateQuizDto, GetQuizItemDto } from './quiz.dto'
import { QuizService } from './quiz.service'

@Controller('quizes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get()
  getQuizes(): Promise<Quiz[]> {
    return this.quizService.getQuizes()
  }

  @Get(':id')
  getQuizById(@Param('id') id: string): Promise<Quiz | null> {
    return this.quizService.getQuizById(id)
  }

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Post()
  async createQuiz(@Body() body: CreateQuizDto): Promise<Quiz> {
    return new GetQuizItemDto(await this.quizService.createQuiz(body))
  }

  @Patch(':id')
  async updateQuiz(@Param('id') id: string, @Body() quizData: any): Promise<Quiz> {
    return this.quizService.updateQuiz(id, quizData)
  }

  @Delete(':id')
  async deleteQuiz(@Param('id') id: string): Promise<void> {
    return this.quizService.deleteQuiz(id)
  }

  @Get('export')
  async exportQuizzes(@Res() res: Response) {
    const quizzes = await this.quizService.getQuizes()
    res.setHeader('Content-Disposition', 'attachment; filename=quizzes.json')
    res.json(quizzes)
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importQuizzes(@UploadedFile() file: Multer.File): Promise<void> {
    const data: CreateQuizDto[] = JSON.parse(fs.readFileSync(file.path, 'utf8'))
    // 1. Xóa tất cả các quiz có title trong danh sách import
    const titles = data.map((quiz) => quiz.title)
    await this.quizService.deleteByTitles(titles)

    // 2. Thêm danh sách quiz mới vào database
    await this.quizService.createMultiple(data)
  }
}

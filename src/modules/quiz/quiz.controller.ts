import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Quiz } from '@prisma/client';
import { CreateQuizDto } from './quiz.dto';
import { Response } from 'express';
import * as fs from 'fs';
import { Multer } from 'multer'; 

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Get()
    getAll(): Promise<Quiz[]> {
      return this.quizService.getAll();
    }
  
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Quiz | null> {
      return this.quizService.getById(id);
    }
  
    @Post()
    async create(@Body() quizData: any): Promise<Quiz> {
      return this.quizService.create(quizData);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
      return this.quizService.delete(id);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() quizData: any): Promise<Quiz> {
      return this.quizService.update(id, quizData);
    }
  
    @Get('export')
    async exportQuizzes(@Res() res: Response) {
      const quizzes = await this.quizService.getAll();
      res.setHeader('Content-Disposition', 'attachment; filename=quizzes.json');
      res.json(quizzes);
    }
  
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importQuizzes(@UploadedFile() file: Multer.File): Promise<void> {
      const data: CreateQuizDto[] = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    // 1. Xóa tất cả các quiz có title trong danh sách import
    const titles = data.map((quiz) => quiz.title);
    await this.quizService.deleteByTitles(titles);
  
    // 2. Thêm danh sách quiz mới vào database
    await this.quizService.createMultiple(data);
    }
}

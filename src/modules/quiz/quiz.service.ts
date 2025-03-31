import { Injectable, NotFoundException } from '@nestjs/common'
import { Quiz } from '@prisma/client'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateQuizDto, UpdateQuizDto } from './quiz.dto'

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Quiz[]> {
    return this.prismaService.quiz.findMany({
      include: { questions: true }
    })
  }

  async getById(id: string): Promise<Quiz | null> {
    return this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })
  }

  async create(data: CreateQuizDto): Promise<Quiz> {
    return this.prismaService.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        tags: data.tags,
        thumbnail: data.thumbnail,
        questions: {
          create: data.questions.map((q) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            answerIndex: q.answerIndex
          }))
        }
      },
      include: { questions: true }
    })
  }

  async update(id: string, data: UpdateQuizDto): Promise<Quiz> {
    // Xóa toàn bộ câu hỏi cũ nếu có danh sách câu hỏi mới
    if (data.questions) {
      await this.prismaService.quizQuestion.deleteMany({
        where: { quizId: id }
      })

      // Lọc bỏ câu hỏi không hợp lệ (undefined/null)
      const validQuestions = data.questions
        .filter((q) => q.question && q.answerIndex !== undefined)
        .map((q) => ({
          quizId: id,
          question: q.question!,
          options: JSON.stringify(q.options || []),
          answerIndex: q.answerIndex!
        }))

      // Chỉ thêm câu hỏi nếu danh sách hợp lệ không rỗng
      if (validQuestions.length > 0) {
        await this.prismaService.quizQuestion.createMany({
          data: validQuestions
        })
      }
    }

    // Cập nhật thông tin quiz
    return this.prismaService.quiz.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        tags: data.tags,
        thumbnail: data.thumbnail
      },
      include: { questions: true }
    })
  }

  async delete(id: string): Promise<void> {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true, plays: true },
    });
  
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
  
    // Xóa các mục liên quan trước (tuân theo ràng buộc FK)
    await this.prismaService.quizPlay.deleteMany({
      where: { quizId: id },
    });
  
    await this.prismaService.quizQuestion.deleteMany({
      where: { quizId: id },
    });
  
    await this.prismaService.quiz.delete({
      where: { id },
    });
  }
  

  async deleteByTitles(titles: string[]): Promise<void> {
    await this.prismaService.quiz.deleteMany({
      where: {
        title: { in: titles }
      }
    })
  }

  async createMultiple(data: CreateQuizDto[]): Promise<void> {
    await this.prismaService.quiz.createMany({ data })
  }
}

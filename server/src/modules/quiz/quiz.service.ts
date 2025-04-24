import { Injectable, NotFoundException } from '@nestjs/common'
import { Quiz } from '@prisma/client'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateQuizDto, QuizQuestionDto, UpdateQuizDto } from './quiz.dto'
import { PaginationMetaDto, PaginationQueryDto } from 'src/shared/models/paging.model'

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuizes(query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const search = query.search?.trim()

    const where = search ? { title: { contains: search } } : {}

    const [quizzes, totalRows] = await this.prismaService.$transaction([
      this.prismaService.quiz.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { questions: true, plays: true }
        // orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.quiz.count({ where })
    ])

    return {
      data: quizzes,
      meta: new PaginationMetaDto({
        page,
        limit,
        totalRows
      })
    }
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    return this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })
  }

  async createQuiz(body: CreateQuizDto): Promise<Quiz> {
    try {
      const { title, description, tags, thumbnail, questions } = body

      // Bước 1: Tạo Quiz
      const quiz = await this.prismaService.quiz.create({
        data: {
          title,
          description,
          tags: JSON.stringify(tags),
          thumbnail
        }
      })

      // Bước 2: Tạo các câu hỏi cho quiz
      await this.createQuestions(quiz.id, questions)

      return quiz
    } catch (error) {
      console.log(error)
      throw new error()
    }
  }

  // Phương thức để tạo câu hỏi cho Quiz
  private async createQuestions(quizId: string, questions: QuizQuestionDto[]) {
    const questionData = questions.map((q) => ({
      quizId,
      question: q.question,
      options: JSON.stringify(q.options),
      answerIndex: q.answerIndex
    }))

    await this.prismaService.quizQuestion.createMany({
      data: questionData
    })
  }

  async updateQuiz(id: string, data: UpdateQuizDto): Promise<Quiz> {
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

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true, plays: true }
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`)
    }

    // Xóa các mục liên quan trước (tuân theo ràng buộc FK)
    await this.prismaService.quizPlay.deleteMany({
      where: { quizId: id }
    })

    await this.prismaService.quizQuestion.deleteMany({
      where: { quizId: id }
    })

    await this.prismaService.quiz.delete({
      where: { id }
    })
  }

  async deleteByTitles(titles: string[]): Promise<void> {
    await this.prismaService.quiz.deleteMany({
      where: {
        title: { in: titles }
      }
    })
  }

  // async createMultiple(data: CreateQuizDto[]): Promise<void> {
  //   await this.prismaService.quiz.createMany({ data })
  // }
}

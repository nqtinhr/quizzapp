import { Injectable, NotFoundException } from '@nestjs/common'
import { Quiz } from '@prisma/client'
import { PaginationDto, PaginationQueryDto } from 'src/shared/models/paging.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateQuizDto, PlayQuizResDto, QuizQuestionDto, UpdateQuizDto } from './quiz.dto'

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuizes(query: PaginationQueryDto) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search?.toLowerCase()

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
      pagination: new PaginationDto({
        page,
        limit,
        totalRows
      })
    }
  }

  async getQuizById(id: string): Promise<any> {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true, plays: true }
    })

    if (!quiz) {
      throw new NotFoundException('Quiz not found')
    }

    return quiz
  }

  async createQuiz(body: CreateQuizDto): Promise<any> {
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

    // Trả về quiz kèm câu hỏi
    const quizWithQuestions = {
      ...quiz,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        answerIndex: q.answerIndex
      }))
    }

    return quizWithQuestions
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

  async deleteQuiz(id: string): Promise<boolean> {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true, plays: true }
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`)
    }

    await this.prismaService.$transaction([
      this.prismaService.quizPlay.deleteMany({ where: { quizId: id } }),
      this.prismaService.quizQuestion.deleteMany({ where: { quizId: id } }),
      this.prismaService.quiz.delete({ where: { id } })
    ])

    return true
  }

  async deleteByTitles(titles: string[]): Promise<void> {
    await this.prismaService.quiz.deleteMany({
      where: {
        title: { in: titles }
      }
    })
  }

  async playQuiz(id: string, userId: string, correctQuestionsNumber: number): Promise<PlayQuizResDto> {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })

    if (!quiz) {
      throw new NotFoundException('Quiz not found')
    }

    const quizPlay = await this.prismaService.quizPlay.create({
      data: {
        quizId: id,
        userId: userId,
        correctQuestionsNumber
      }
    })

    return new PlayQuizResDto(quizPlay)
  }

  async getQuizPlays(userId): Promise<PlayQuizResDto[]> {
    const quizPlays = await this.prismaService.quizPlay.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true
          }
        }
      }
    })
    return quizPlays.map((qp) => new PlayQuizResDto(qp))
  }

  // Trả về các câu hỏi của quiz
  // const quizQuestions = await this.prismaService.quizQuestion.findMany({
  // async createMultiple(data: CreateQuizDto[]): Promise<void> {
  //   await this.prismaService.quiz.createMany({ data })
  // }
}

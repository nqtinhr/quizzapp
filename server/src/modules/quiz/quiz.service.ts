import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginationDto, PaginationQueryDto } from 'src/shared/models/paging.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CreateQuizDto,
  GetAllPlayQuizzesResDto,
  PlayQuizResDto,
  QuizQuestionDto,
  UpdateQuizDto,
  UpdateQuizQuestionDto
} from './quiz.dto'

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuizes(query: PaginationQueryDto) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const search = query.search?.toLowerCase()

    const where = search ? { title: { contains: search } } : {}

    const [quizzes, totalRows] = await this.prismaService.$transaction([
      this.prismaService.quiz.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { questions: true, plays: true }
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

  async updateQuiz(id: string, quizData: UpdateQuizDto): Promise<any> {
    const { title, description, tags, thumbnail, questions } = quizData

    // Step 1: Tìm quiz
    const existingQuiz = await this.prismaService.quiz.findUnique({
      where: { id }
    })

    if (!existingQuiz) {
      throw new Error('Quiz not found')
    }

    // Step 2: Update the quiz info
    const updatedQuiz = await this.prismaService.quiz.update({
      where: { id },
      data: {
        title: title ?? existingQuiz.title,
        description: description ?? existingQuiz.description,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags,
        thumbnail: thumbnail ?? existingQuiz.thumbnail
      }
    })

    // Step 3: Cập nhật questions nếu được cung cấp
    if (questions) {
      await this.updateQuestions(id, questions)
    }

    const quizWithQuestions = {
      ...updatedQuiz,
      questions: (questions ?? []).map((q) => ({
        question: q.question,
        options: q.options,
        answerIndex: q.answerIndex
      }))
    }

    return quizWithQuestions
  }

  private async updateQuestions(quizId: string, questions: UpdateQuizQuestionDto[]) {
    const questionIds = questions.filter((q): q is { id: string } => !!q.id).map((q) => q.id)

    // Step 1: Xóa các câu hỏi không còn tồn tại
    await this.prismaService.quizQuestion.deleteMany({
      where: {
        quizId,
        id: {
          notIn: questionIds.length > 0 ? questionIds : ['']
        }
      }
    })

    // Step 2: Update hoặc Create tất cả questions mới bằng Promise.all
    const questionPromises = questions.map((q) => {
      const data = {
        quizId,
        question: q.question ?? '',
        options: q.options ? JSON.stringify(q.options) : '[]',
        answerIndex: q.answerIndex ?? 0
      }

      if (q.id) {
        return this.prismaService.quizQuestion.update({
          where: { id: q.id },
          data
        })
      } else {
        return this.prismaService.quizQuestion.create({
          data
        })
      }
    })

    await Promise.all(questionPromises)
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

  async historyQuizPlays(userId: string, query: PaginationQueryDto): Promise<GetAllPlayQuizzesResDto> {
    return this.getQuizPlaysBase(query, userId)
  }

  async historyAllQuizPlays(query: PaginationQueryDto): Promise<GetAllPlayQuizzesResDto> {
    return this.getQuizPlaysBase(query)
  }

  private async getQuizPlaysBase(
    query: PaginationQueryDto,
    userId?: string
  ): Promise<{ data: any[]; pagination: PaginationDto }> {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const search = query.search?.toLowerCase()

    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (search) {
      where.quiz = {
        title: {
          contains: search
        }
      }
    }

    const [quizPlays, totalRows] = await this.prismaService.$transaction([
      this.prismaService.quizPlay.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          playedAt: 'desc'
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              questions: true
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
      }),
      this.prismaService.quizPlay.count({ where })
    ])

    return {
      data: quizPlays,
      pagination: new PaginationDto({
        page,
        limit,
        totalRows
      })
    }
  }

  async importQuizzes(data: CreateQuizDto[]): Promise<number> {
    const imported: CreateQuizDto[] = []

    for (const quizDto of data) {
      const quiz = await this.createQuiz(quizDto)
      imported.push(quiz)
    }

    return imported.length
  }

  async exportQuizzes(): Promise<any[]> {
    const quizzes = await this.prismaService.quiz.findMany({
      include: {
        questions: true
      }
    })

    return quizzes.map((quiz) => ({
      title: quiz.title,
      description: quiz.description,
      tags: JSON.parse(quiz.tags || '[]'),
      thumbnail: quiz.thumbnail,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: JSON.parse(q.options),
        answerIndex: q.answerIndex
      }))
    }))
  }
}

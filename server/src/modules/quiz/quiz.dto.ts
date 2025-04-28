import { Type } from 'class-transformer'
import { IsString, IsOptional, IsArray, IsInt, IsUUID, Min } from 'class-validator'
import { PaginationDto } from 'src/shared/models/paging.model'
import { QuizModel, QuizPlayModel, QuizQuestionModel } from 'src/shared/models/quiz.model'

export class GetAllQuizzesResDto {
  @Type(() => QuizModel)
  data: QuizModel[]

  pagination: PaginationDto

  constructor(data: any[], pagination: PaginationDto) {
    this.data = data.map((item) => new QuizModel(item))
    this.pagination = pagination
  }
}

export class GetQuizItemResDto extends QuizModel {
  constructor(partial: Partial<GetQuizItemResDto>) {
    super(partial)
    this.tags = typeof partial.tags === 'string' ? JSON.parse(partial.tags) : (partial.tags ?? [])
    this.questions = (partial.questions ?? []).map((q) => new QuizQuestionModel(q))
    this.plays = (partial.plays ?? []).map((p) => new QuizPlayModel(p))
  }
}

export class CreateQuizDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @IsOptional()
  @IsString()
  thumbnail?: string

  @IsArray()
  questions: QuizQuestionDto[]

  @IsOptional()
  @IsArray()
  plays?: QuizPlayDto[]
}

export class QuizQuestionDto {
  @IsString()
  question: string

  @IsArray()
  options: string[]

  @IsInt()
  answerIndex: number
}

export class QuizPlayDto {
  @IsString()
  userId: string

  @IsString()
  quizId: string
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string

  @IsOptional()
  @IsString()
  thumbnail?: string

  @IsOptional()
  @IsArray()
  questions?: UpdateQuizQuestionDto[]
}

export class UpdateQuizQuestionDto {
  @IsOptional()
  @IsUUID()
  id?: string

  @IsOptional()
  @IsString()
  question?: string

  @IsOptional()
  @IsArray()
  options?: string[]

  @IsOptional()
  @IsInt()
  answerIndex?: number
}

export class PlayQuizDto {
  @IsInt()
  @Min(0)
  correctQuestionsNumber: number
}

export class GetAllPlayQuizzesResDto {
  @Type(() => PlayQuizResDto)
  data: PlayQuizResDto[]

  pagination: PaginationDto

  constructor(data: any[], pagination: PaginationDto) {
    this.data = data.map((item) => new PlayQuizResDto(item))
    this.pagination = pagination
  }
}

export class PlayQuizResDto extends QuizPlayModel {
  constructor(partial: Partial<PlayQuizResDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}

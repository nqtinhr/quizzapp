import { IsString, IsOptional, IsArray, IsInt, IsUUID } from 'class-validator';
import { QuizModel } from 'src/shared/models/quiz.model';

export class GetQuizItemDto extends QuizModel {}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  questions: QuizQuestionDto[];

  @IsArray()
  plays?: QuizPlayDto[];
}

export class QuizQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];

  @IsInt()
  answerIndex: number;
}

export class QuizPlayDto {
  @IsString()
  userId: string;

  @IsString()
  quizId: string;
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  questions?: UpdateQuizQuestionDto[];
}

export class UpdateQuizQuestionDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsInt()
  answerIndex?: number;
}

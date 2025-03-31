import { IsString, IsOptional, IsArray, IsInt, IsUUID } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  tags: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  questions: CreateQuizQuestionDto[];
}

export class CreateQuizQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];

  @IsInt()
  answerIndex: number;
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

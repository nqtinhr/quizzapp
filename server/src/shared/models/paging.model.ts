import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationDto {
  page: number
  limit: number
  totalRows: number

  constructor(partial: Partial<PaginationDto>) {
    Object.assign(this, partial)
  }
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10

  @IsOptional()
  search?: string
}

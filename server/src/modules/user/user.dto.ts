import { Exclude } from 'class-transformer'
import { PaginationDto } from 'src/shared/models/paging.model'

export class ProfileResDto {
  id: string
  name: string
  email: string
  picture: string
  role: string

  @Exclude()
  password: string

  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<ProfileResDto>) {
    Object.assign(this, partial)
  }
}

export class GetAllUsersResDto {
  data: ProfileResDto[]
  pagination: PaginationDto

  constructor(data: ProfileResDto[], pagination: PaginationDto) {
    this.data = data.map((item) => new ProfileResDto(item))
    this.pagination = pagination
  }
}

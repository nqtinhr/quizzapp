import { Exclude } from 'class-transformer'
import { PaginationMetaDto } from 'src/shared/models/paging.model'

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
  meta: PaginationMetaDto

  constructor(data: any[], meta: PaginationMetaDto) {
    this.data = data.map((item) => new ProfileResDto(item))
    this.meta = meta
  }
}


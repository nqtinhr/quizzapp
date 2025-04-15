import { Exclude } from 'class-transformer'

export class ProfileResDto {
  id: string
  name: string
  email: string
  picture: string
  role: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<ProfileResDto>) {
    Object.assign(this, partial)
  }
}

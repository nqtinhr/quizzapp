import { Exclude } from "class-transformer"

export class UserModel {
  id: string
  email: string
  name: string
  @Exclude() password: string
  role: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}

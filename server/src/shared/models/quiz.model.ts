export class QuizModel {
  id: string
  title: string
  description: string | null
  tags: string
  thumbnail: string | null
  questions: QuizQuestionModel[]
  plays: QuizPlayModel[]

  constructor(partial: Partial<QuizModel>) {
    Object.assign(this, partial)
  }
}

export class QuizQuestionModel {
  question: string
  options: string[]
  answerIndex: number
}

export class QuizPlayModel {
  id: string
  quizId: string
  userId: string
  correctQuestionsNumber: number
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<QuizPlayModel>) {
    Object.assign(this, partial)
  }
}
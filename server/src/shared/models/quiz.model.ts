
export class QuizModel {
  id: string
  title: string
  description?: string 
  tags: string[]
  thumbnail?: string 
  questions: QuizQuestionModel[]
  plays?: QuizPlayModel[]

  constructor(partial: Partial<QuizModel>) {
    Object.assign(this, partial)

    this.tags = typeof partial.tags === 'string'
      ? JSON.parse(partial.tags)
      : partial.tags ?? []

    this.questions = (partial.questions ?? []).map((q) => new QuizQuestionModel(q))

    this.plays = (partial.plays ?? []).map((p) => new QuizPlayModel(p))
  }
}

export class QuizQuestionModel {
  question: string
  options: string[] 
  answerIndex: number

  constructor(partial: Partial<QuizQuestionModel>) {
    Object.assign(this, partial)

    this.options = typeof partial.options === 'string'
      ? JSON.parse(partial.options)
      : partial.options ?? []
  }
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

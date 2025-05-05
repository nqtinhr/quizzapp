export interface IQuizQuestion {
  question: string
  options: string[]
  answerIndex: number
}

export interface IQuiz {
  id?: string
  title: string
  description: string
  tags: string[]
  thumbnail: string
  questions: IQuizQuestion[]
  plays?: IQuizPlay[]
}

export interface IQuizPlay {
  quizId: string
  quizTitle: string
  playedAt: Date
  questionsNumber: number
  correctQuestionsNumber: number
  quiz?: {
    id: string
    title: string
    questions: string[]
  }
  user?: {
    id: string
    name: string
    email: string
    picture: string
  }
}

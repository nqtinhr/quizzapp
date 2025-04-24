import { IQuiz } from '@/types/IQuiz'

export const parseQuiz = (quiz: any): IQuiz => ({
  ...quiz,
  tags: typeof quiz.tags === 'string' ? JSON.parse(quiz.tags) : quiz.tags,
  questions: quiz.questions.map((q: any) => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
  }))
})

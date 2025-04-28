import { AN_OPTION_MUST_BE_SELECTED, MANDATORY } from '@/constants/common'
import { IQuiz } from '@/types/quiz'

export const validate = (quiz: IQuiz): QuizErrors => {
  const errors = new QuizErrors()
  if (!quiz.title) errors.title = MANDATORY
  if (!quiz.description) errors.description = MANDATORY
  if (quiz.tags.length === 0) errors.tags = MANDATORY
  if (!quiz.thumbnail) errors.thumbnail = MANDATORY

  errors.questions = []
  quiz.questions.forEach((question) => {
    const questionErrors = new QuizQuestionErrors()
    if (!question.question) questionErrors.question = MANDATORY
    if (question.answerIndex === -1) questionErrors.answer = AN_OPTION_MUST_BE_SELECTED
    question.options.forEach((value) => questionErrors.options.push(!value ? MANDATORY : ''))
    errors.questions.push(questionErrors)
  })

  return errors
}

export class QuizErrors {
  title: string = ''
  description: string = ''
  tags: string = ''
  thumbnail: string = ''
  questions: QuizQuestionErrors[] = [new QuizQuestionErrors()]

  isNotEmpty = () =>
    this.title ||
    this.description ||
    this.tags ||
    this.thumbnail ||
    this.questions.filter((q) => q.isNotEmpty()).length > 0
}

export class QuizQuestionErrors {
  question: string = ''
  options: string[] = []
  answer: string = ''

  isNotEmpty = () => this.question || this.answer || this.options.filter((o) => o && o !== '').length > 0
}

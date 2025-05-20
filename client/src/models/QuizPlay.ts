import { IQuizPlay } from '@/types/quiz'

export class QuizPlay {
  quizId = ''
  quizTitle = ''
  playedAt = new Date()
  questionsNumber = 0
  correctQuestionsNumber = 0

  static getPercentage = (quizPlay: IQuizPlay) => {
    return `${Math.ceil((quizPlay.correctQuestionsNumber * 100) / quizPlay.questionsNumber)} %`
  }
}

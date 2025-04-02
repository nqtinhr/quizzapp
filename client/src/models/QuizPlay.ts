export class QuizPlay {
  quizId = ''
  quizTitle = ''
  playedAt = new Date()
  questionsNumber = 0
  correctQuestionsNumber = 0

  static getPercentage = (quizPlay: QuizPlay) => {
    return `${Math.ceil((quizPlay.correctQuestionsNumber * 100) / quizPlay.questionsNumber)} %`
  }
}

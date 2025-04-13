import PageTitle from '@/components/PageTitle/PageTitle'
import { Quiz } from '@/models/Quiz'
import { QuizPlay } from '@/models/QuizPlay'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlayQuizQuestions from './PlayQuizQuestions/PlayQuizQuestions'
import PlayQuizResult from './PlayQuizResult/PlayQuizResult'

const PlayQuiz = () => {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<Quiz>(new Quiz())
  const [correctQuestionsNumber, setCorrectQuestionsNumber] = useState<number>(0)
  const [viewQuestions, setViewQuestions] = useState<boolean>(true)

  // useEffect(() => {
  //   HttpClient.get<Quiz>(`/quizzes/${id}`).then((res) => setQuiz(res.data))
  // }, [])

  const handleViewResult = (correctQuestionsNumber: number) => {
    const data = new QuizPlay()
    data.correctQuestionsNumber = correctQuestionsNumber
    // HttpClient.post(`/users/current/quizzes/${id}/plays`, data)
    setCorrectQuestionsNumber(correctQuestionsNumber)
    setViewQuestions(false)
  }

  return (
    <>
      <PageTitle value={quiz.title} />
      <PlayQuizQuestions visible={viewQuestions} quiz={quiz} onViewResult={handleViewResult} />
      <PlayQuizResult
        visible={!viewQuestions}
        quizQuestions={quiz.questions.length}
        correctQuestionsNumber={correctQuestionsNumber}
      />
    </>
  )
}

export default PlayQuiz

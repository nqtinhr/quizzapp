import quizApi from '@/api/quizApi'
import PageTitle from '@/components/PageTitle/PageTitle'
import PlayQuizQuestions from '@/components/PlayQuizQuestions/PlayQuizQuestions'
import PlayQuizResult from '@/components/PlayQuizResult/PlayQuizResult'
import { Quiz } from '@/models/Quiz'
import { QuizPlay } from '@/models/QuizPlay'
import { IQuiz } from '@/types/IQuiz'
import { parseQuiz } from '@/utils/convert'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PlayQuiz = () => {
  const { id } = useParams()
  console.log("🚀 ~ PlayQuiz ~ id:", id)
  const [quiz, setQuiz] = useState<IQuiz>(new Quiz())
  const [correctQuestionsNumber, setCorrectQuestionsNumber] = useState<number>(0)
  const [viewQuestions, setViewQuestions] = useState<boolean>(true)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const result = await quizApi.getQuiz(id!)
      setQuiz(parseQuiz(result.data))
    })()
  }, [id])

  const handleViewResult = (correctQuestionsNumber: number) => {
    const data = new QuizPlay()
    data.correctQuestionsNumber = correctQuestionsNumber
    console.log("🚀 ~ handleViewResult ~ data:", data)
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

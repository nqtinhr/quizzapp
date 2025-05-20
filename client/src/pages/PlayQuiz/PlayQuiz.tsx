import quizApi from '@/api/quizApi'
import PageTitle from '@/components/PageTitle/PageTitle'
import PlayQuizQuestions from '@/components/PlayQuizQuestions/PlayQuizQuestions'
import PlayQuizResult from '@/components/PlayQuizResult/PlayQuizResult'
import { Quiz } from '@/models/Quiz'
import { IQuiz } from '@/types/quiz'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PlayQuiz = () => {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<IQuiz>(new Quiz())
  const [correctQuestionsNumber, setCorrectQuestionsNumber] = useState<number>(0)
  const [viewQuestions, setViewQuestions] = useState<boolean>(true)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const result = await quizApi.getQuiz(id!)
      setQuiz(result.data)
    })()
  }, [id])

  const handleViewResult = async (correctQuestionsNumber: number) => {
    await quizApi.playQuiz(id!, correctQuestionsNumber)
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

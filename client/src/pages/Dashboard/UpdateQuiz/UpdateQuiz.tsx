import quizApi from '@/api/quizApi'
import PageTitle from '@/components/PageTitle/PageTitle'
import QuizForm from '@/components/QuizForm/QuizForm'
import { UPDATE_QUIZ_PAGE_TITLE } from '@/constants/common'
import { IQuiz } from '@/types/quiz'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const UpdateQuiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (quiz: IQuiz) => {
    const { id, ...quizDataWithoutId } = quiz 

    const result: any = await quizApi.updateQuiz(id as string, quizDataWithoutId)
    if (result.statusCode === 200) {
      toast.success('Quiz updated successfully')
      navigate('/admin/quiz')
    }
  }

  return (
    <>
      <PageTitle value={UPDATE_QUIZ_PAGE_TITLE} />
      <QuizForm id={id} onSubmit={handleSubmit} />
    </>
  )
}

export default UpdateQuiz

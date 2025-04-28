import quizApi from '@/api/quizApi'
import PageTitle from '@/components/PageTitle/PageTitle'
import QuizForm from '@/components/QuizForm/QuizForm'
import { CREATE_QUIZ_PAGE_TITLE } from '@/constants/common'
import { IQuiz } from '@/types/quiz'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AddQuiz = () => {
  const navigate = useNavigate()

  const handleSubmit = async (quiz: IQuiz) => {
    delete quiz.id

    const result: any = await quizApi.createQuiz(quiz)
    if (result.statusCode === 201) {
      toast.success('Quiz created successfully')
      navigate('/admin/quiz')
    }
  }

  return (
    <>
      <PageTitle value={CREATE_QUIZ_PAGE_TITLE} />
      <QuizForm onSubmit={handleSubmit} />
    </>
  )
}

export default AddQuiz

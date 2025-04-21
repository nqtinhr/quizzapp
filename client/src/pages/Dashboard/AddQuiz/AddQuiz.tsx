import PageTitle from '@/components/PageTitle/PageTitle'
import QuizForm from '@/components/QuizForm/QuizForm'
import { CREATE_QUIZ_PAGE_TITLE } from '@/constants/common'
import { Quiz } from '@/models/Quiz'
import { useNavigate } from 'react-router-dom'

const AddQuiz = () => {
  const navigate = useNavigate()

  const handleSubmit = (quiz: Quiz) => {
    // HttpClient.post('/quizzes', quiz).then(() => {
    //   ToastService.success('Quiz ajouté avec succès')
    navigate('/admin/quiz')
    console.log('🚀 ~ handleSubmit ~ quiz:', quiz)
    // })
  }

  return (
    <>
      <PageTitle value={CREATE_QUIZ_PAGE_TITLE} />
      <QuizForm onSubmit={handleSubmit} />
    </>
  )
}

export default AddQuiz

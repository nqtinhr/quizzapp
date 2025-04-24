import Banner from '@/components/Banner/Banner'
import Loader from '@/components/Loader/Loader'
import PageTitle from '@/components/PageTitle/PageTitle'
import QuizCard from '@/components/QuizCard/QuizCard'
import { HOME_PAGE_TITLE } from '@/constants/common'
import { quizListAPI } from '@/redux/quizSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useEffect } from 'react'
import styles from './Home.module.css'

const Home = () => {
  const dispatch = useAppDispatch()
  const { quizzes, loading } = useAppSelector((state) => state.quiz)

  useEffect(() => {
    dispatch(quizListAPI())
  }, [dispatch])

  const parsedQuizzes = quizzes.map((quiz) => ({
    ...quiz,
    tags: typeof quiz.tags === 'string' ? JSON.parse(quiz.tags) : quiz.tags,
    questions: quiz.questions.map((question) => ({
      ...question,
      options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options
    }))
  }))

  return (
    <>
      <Banner />
      <PageTitle value={HOME_PAGE_TITLE} />
      <Loader visible={loading} />
      <div className={styles.quizzes}>
        {parsedQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </>
  )
}

export default Home

import { useState } from 'react'
import styles from './Home.module.css'
import Banner from '@/components/Banner/Banner'
import PageTitle from '@/components/PageTitle/PageTitle'
import { Quiz } from '@/models/Quiz'
import { HOME_PAGE_TITLE } from '@/constants/common'
import Loader from '@/components/Loader/Loader'
import QuizCard from '@/components/QuizCard/QuizCard'

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  return (
    <>
      <Banner />
      <PageTitle value={HOME_PAGE_TITLE} />
      <Loader visible={loading} />
      <div className={styles.quizzes}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </>
  )
}

export default Home

import PageTitle from '@/components/PageTitle/PageTitle'
import { NO_DATA_FOUND, QUIZ, QUIZ_PERCENTAGE, QUIZ_PLAYED_AT, USER_HISTORY } from '@/constants/common'
import { QuizPlay } from '@/models/QuizPlay'
import { useState } from 'react'
import Table from 'react-table-lite'
import styles from './History.module.css'

const History = () => {
  const [quizPlays, setQuizPlays] = useState<QuizPlay[]>([])

  // useEffect(() => {
  //   HttpClient.get<QuizPlay[]>('/users/current/quizzes/plays').then((res) => setQuizPlays(res.data))
  // }, [])

  return (
    <>
      <PageTitle value={USER_HISTORY} />
      <Table
        data={quizPlays}
        headers={['quizTitle', 'playedAt', 'pourcentage']}
        customHeaders={{ quizTitle: QUIZ, playedAt: QUIZ_PLAYED_AT, pourcentage: QUIZ_PERCENTAGE }}
        customRenderCell={{
          quizTitle: (quizPlay: QuizPlay) => (
            <a className={styles.link} href={`/quiz/${quizPlay.quizId}`}>
              {quizPlay.quizTitle}
            </a>
          ),
          pourcentage: (quizPlay: QuizPlay) => QuizPlay.getPercentage(quizPlay)
        }}
        noDataMessage={NO_DATA_FOUND}
      ></Table>
    </>
  )
}

export default History

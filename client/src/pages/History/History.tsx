import PageTitle from '@/components/PageTitle/PageTitle'
import { NO_DATA_FOUND, QUIZ, QUIZ_PERCENTAGE, QUIZ_PLAYED_AT, USER_HISTORY } from '@/constants/common'
import { historyAllQuizPlaysAPI, historyQuizPlaysAPI } from '@/redux/quizSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { selectCurrentUser } from '@/redux/userSlice'
import { IQuizPlay } from '@/types/quiz'
import { useEffect } from 'react'
import Table from 'react-table-lite'
import styles from './History.module.css'

const History = () => {
  const dispatch = useAppDispatch()
  const { quizPlays, pagination } = useAppSelector((state) => state.quiz)
  const currentUser = useAppSelector(selectCurrentUser)

  const isAdminOrModerator = currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR'

  useEffect(() => {
    if (!currentUser) return

    if (isAdminOrModerator) {
      dispatch(historyAllQuizPlaysAPI({ params: { page: pagination.page, limit: pagination.limit } }))
    } else {
      dispatch(historyQuizPlaysAPI({ params: { page: pagination.page, limit: pagination.limit } }))
    }
  }, [currentUser, isAdminOrModerator, dispatch, pagination.page, pagination.limit])

  const headers = ['quizTitle', ...(isAdminOrModerator ? ['userEmail', 'userPicture'] : []), 'playedAt', 'pourcentage']

  const customHeaders: Record<string, string> = {
    quizTitle: QUIZ,
    ...(isAdminOrModerator && {
      userEmail: 'Email',
      userPicture: 'Picture'
    }),
    playedAt: QUIZ_PLAYED_AT,
    pourcentage: QUIZ_PERCENTAGE
  }

  return (
    <>
      <PageTitle value={USER_HISTORY} />
      <Table
        data={quizPlays}
        headers={headers}
        customHeaders={customHeaders}
        customRenderCell={{
          quizTitle: (quizPlay: IQuizPlay) => (
            <a className={styles.link} href={`/quiz/${quizPlay.quiz?.id}`}>
              {quizPlay.quiz?.title}
            </a>
          ),
          playedAt: (quizPlay: IQuizPlay) => new Date(quizPlay.playedAt).toLocaleString(),
          pourcentage: (quizPlay: IQuizPlay) =>
            `${quizPlay.quiz?.questions ? Math.ceil((quizPlay.correctQuestionsNumber * 100) / quizPlay.quiz.questions.length) : 0}%`,
          ...(isAdminOrModerator && {
            userEmail: (quizPlay: IQuizPlay) => quizPlay.user?.email || '',
            userPicture: (quizPlay: IQuizPlay) =>
              quizPlay.user?.picture ? (
                <img src={quizPlay.user.picture} alt='avatar' width={40} height={40} style={{ borderRadius: '50%' }} />
              ) : (
                ''
              )
          })
        }}
        noDataMessage={NO_DATA_FOUND}
      ></Table>
    </>
  )
}

export default History

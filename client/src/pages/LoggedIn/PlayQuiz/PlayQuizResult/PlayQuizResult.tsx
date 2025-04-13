import { QUIZ_CORRECT_QUESTIONS, QUIZ_MISSED_QUESTIONS, USER_SCORE } from '@/constants/common'
import styles from './PlayQuizResult.module.css'
import { GoX } from 'react-icons/go'
import { GoCheck } from 'react-icons/go'

type PlayQuizResultProps = {
  visible: boolean
  quizQuestions: number
  correctQuestionsNumber: number
}

const PlayQuizResult = ({ visible, quizQuestions, correctQuestionsNumber }: PlayQuizResultProps) => {
  return (
    visible && (
      <div className={styles.container}>
        <p className={styles.title}>{USER_SCORE}</p>
        <p className={styles.percent}>{Math.ceil((correctQuestionsNumber * 100) / quizQuestions)}%</p>
        <div className={styles.correct}>
          <GoCheck className={styles.icon} />
          <b>{correctQuestionsNumber}</b>
          <p>{QUIZ_CORRECT_QUESTIONS}</p>
        </div>
        <div className={styles.incorrect}>
          <GoX className={styles.icon} />
          <b>{quizQuestions - correctQuestionsNumber}</b>
          <p>{QUIZ_MISSED_QUESTIONS}</p>
        </div>
      </div>
    )
  )
}

export default PlayQuizResult

import { IQuiz } from '@/types/quiz'
import { Link } from 'react-router-dom'
import styles from './QuizCard.module.css'

type QuizCardProps = {
  quiz: IQuiz
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Link className={styles.container} to={`/quiz/${quiz.id}`}>
      <img src={quiz.thumbnail} alt='thumbnail' />
      <div className={styles.bottom}>
        <div className={styles.tags}>
          {quiz.tags.map((tag: string) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className={styles.title}>{quiz.title}</p>
        <p className={styles.description}>{quiz.description}</p>
      </div>
    </Link>
  )
}

export default QuizCard

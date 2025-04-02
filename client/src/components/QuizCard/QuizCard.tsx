import { Link } from 'react-router-dom'
import styles from './QuizCard.module.css'
import { Quiz } from '@/models/Quiz'

type QuizCardProps = {
  quiz: Quiz
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Link className={styles.container} to={`/quiz/${quiz.id}`}>
      <img src={quiz.thumbnail} alt='' />
      <div className={styles.bottom}>
        <div className={styles.tags}>
          {quiz.tags.map((tag) => (
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

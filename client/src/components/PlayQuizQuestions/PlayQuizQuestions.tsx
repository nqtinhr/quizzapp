import Button from '@/components/Button/Button'
import { NEXT_QUESTION, PREVIOUS_QUESTION, VIEW_QUIZ_RESULT } from '@/constants/common'
import { IQuiz } from '@/types/quiz'
import { useRef, useState } from 'react'
import styles from './PlayQuizQuestions.module.css'

type PlayQuizQuestionProps = {
  visible: boolean
  quiz: IQuiz
  onViewResult: (correctQuestionsNumber: number) => void
}

const PlayQuizQuestions = ({ visible, quiz, onViewResult }: PlayQuizQuestionProps) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1)
  const correctQuestionsNumber = useRef<number>(0)

  const isCorrectAnswer = () => {
    return quiz.questions[questionIndex].answerIndex === selectedOptionIndex
  }

  const isFirstQuestion = () => {
    return questionIndex === 0
  }

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion()) {
      setQuestionIndex(questionIndex - 1)
      setSelectedOptionIndex(-1)
    }
  }

  const isLastQuestion = () => {
    return questionIndex === quiz.questions.length - 1
  }

  const handleAnswerQuestion = () => {
    if (selectedOptionIndex === -1) {
      // ToastService.error(SELECT_ANSWER_IS_MANDATORY, 2000)
      return
    }
    if (isCorrectAnswer()) {
      correctQuestionsNumber.current += 1
    }
    if (isLastQuestion()) {
      onViewResult(correctQuestionsNumber.current)
    } else {
      setSelectedOptionIndex(-1)
      setQuestionIndex(questionIndex + 1)
    }
  }

  return (
    visible && (
      <div className={styles.container}>
        <div className={styles.questionIndex}>
          Question {questionIndex + 1}/{quiz.questions.length}
        </div>
        <h2>{quiz.questions[questionIndex].question}</h2>

        <div className={styles.options}>
          {quiz.questions[questionIndex].options.map((option: string, index: number) => (
            <div
              key={index}
              className={[styles.option, selectedOptionIndex == index ? styles.selected : ''].join(' ')}
              onClick={() => setSelectedOptionIndex(index)}
            >
              <span className={styles.prefix}>{['A', 'B', 'C', 'D'][index]}</span>
              <span className={styles.value}>{option}</span>
            </div>
          ))}
        </div>

        <div className={styles.navigation}>
          {!isFirstQuestion() && <Button onClick={handlePreviousQuestion}>{PREVIOUS_QUESTION}</Button>}
          <Button onClick={handleAnswerQuestion}>{isLastQuestion() ? VIEW_QUIZ_RESULT : NEXT_QUESTION}</Button>
        </div>
      </div>
    )
  )
}

export default PlayQuizQuestions

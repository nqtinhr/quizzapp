import styles from './QuizForm.module.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { Tooltip } from 'react-tooltip'
import Input from '../Input/Input'
import QuizTagsInput from '../QuizTagsInput/QuizTagsInput'
import QuizQuestionInput from '../QuizQuestionInput/QuizQuestionInput'
import Label from '../Label/Label'
import {
  ADD,
  MANDATORY,
  QUIZ_DESCRIPTION,
  QUIZ_QUESTIONS,
  QUIZ_TAGS,
  QUIZ_THUMBNAIL_URL,
  QUIZ_TITLE
} from '@/constants/common'
import SubmitButton from '../Button/SubmitButton'
import { Quiz } from '@/models/Quiz'
import { QuizErrors, QuizQuestionErrors, validate } from '@/models/QuizValidator'
import { QuizQuestion } from '@/models/QuizQuestion'

type QuizFormProps = {
  id?: string
  onSubmit: (quiz: Quiz) => void
}

const QuizForm = ({ id, onSubmit }: QuizFormProps) => {
  const [quiz, setQuiz] = useState<Quiz>(new Quiz())
  const [quizErrors, setQuizErrors] = useState(new QuizErrors())

  useEffect(() => {
    if (!id) return
    // HttpClient.get<Quiz>(`/quizzes/${id}`).then((res) => {
    //   setQuiz(res.data)
    //   setQuizErrors({ ...quizErrors, questions: res.data.questions.map((_) => new QuizQuestionErrors()) })
    // })
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setQuiz({ ...quiz, [name]: value })
    setQuizErrors({ ...quizErrors, [name]: value ? '' : MANDATORY })
  }

  const handleTagsChange = (tags: string[]) => {
    setQuiz({ ...quiz, tags })
    setQuizErrors({ ...quizErrors, tags: tags.length > 0 ? '' : MANDATORY })
  }

  const handleQuestionChange = (question: QuizQuestion, index: number) => {
    const questions = quiz.questions
    questions.splice(index, 1, question)
    setQuiz({ ...quiz, questions })

    const questionsErrors = quizErrors.questions
    questionsErrors.splice(index, 1, new QuizQuestionErrors())
    setQuizErrors({ ...quizErrors, questions: questionsErrors })
  }

  const handleQuestionAdd = () => {
    setQuiz({ ...quiz, questions: [new QuizQuestion(), ...quiz.questions] })
    setQuizErrors({ ...quizErrors, questions: [new QuizQuestionErrors(), ...quizErrors.questions] })
  }

  const handleQuestionRemove = (index: number) => {
    if (quiz.questions.length === 1) {
      // ToastService.error('Un quiz doit contenir au moins une question')
      return
    }
    const questions = quiz.questions
    questions.splice(index, 1)
    setQuiz({ ...quiz, questions })

    const questionsErrors = quizErrors.questions
    questionsErrors.splice(index, 1)
    setQuizErrors({ ...quizErrors, questions: questionsErrors })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Lorsqu'un formulaire est soumis, le comportement par défaut du navigateur est de recharger la page
    const errors = validate(quiz)
    if (errors.isNotEmpty()) {
      setQuizErrors(errors)
      // ToastService.error('Quiz Invalid')
      return
    }
    onSubmit(quiz)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input label={QUIZ_TITLE} name='title' value={quiz.title} error={quizErrors.title} onChange={handleInputChange} />
      <Input
        label={QUIZ_DESCRIPTION}
        name='description'
        value={quiz.description}
        error={quizErrors.description}
        onChange={handleInputChange}
      />
      <QuizTagsInput label={QUIZ_TAGS} value={quiz.tags} error={quizErrors.tags} onChange={handleTagsChange} />
      <Input
        label={QUIZ_THUMBNAIL_URL}
        name='thumbnail'
        value={quiz.thumbnail}
        error={quizErrors.thumbnail}
        onChange={handleInputChange}
      />

      <div className={styles.questionsLabelContainer}>
        <Label>{QUIZ_QUESTIONS}</Label>
        <Tooltip id='add-question' />
        <AiOutlinePlus
          data-tooltip-id='add-question'
          data-tooltip-content={ADD}
          className={styles.addQuestionIcon}
          onClick={handleQuestionAdd}
        />
      </div>

      {quiz.questions.map((question, index) => (
        <QuizQuestionInput
          key={index}
          value={question}
          index={index}
          errors={quizErrors.questions[index]}
          onRemove={handleQuestionRemove}
          onChange={handleQuestionChange}
        />
      ))}

      <SubmitButton className={styles.submit} />
    </form>
  )
}

export default QuizForm

import quizApi from '@/api/quizApi'
import {
  ADD,
  MANDATORY,
  QUIZ_DESCRIPTION,
  QUIZ_QUESTIONS,
  QUIZ_TAGS,
  QUIZ_THUMBNAIL_URL,
  QUIZ_TITLE
} from '@/constants/common'
import { Quiz } from '@/models/Quiz'
import { QuizQuestion } from '@/models/QuizQuestion'
import { QuizErrors, QuizQuestionErrors, validate } from '@/models/QuizValidator'
import { IQuiz, IQuizQuestion } from '@/types/quiz'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import SubmitButton from '../Button/SubmitButton'
import Input from '../Input/Input'
import Label from '../Label/Label'
import QuizQuestionInput from '../QuizQuestionInput/QuizQuestionInput'
import QuizTagsInput from '../QuizTagsInput/QuizTagsInput'
import styles from './QuizForm.module.css'

type QuizFormProps = {
  id?: string
  onSubmit: (quiz: IQuiz) => void
}

const QuizForm = ({ id, onSubmit }: QuizFormProps) => {
  const [quiz, setQuiz] = useState<IQuiz>(new Quiz())
  const [quizErrors, setQuizErrors] = useState(new QuizErrors())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const result = await quizApi.getQuiz(id!)
      setQuiz(result.data)
    })()
  }, [id])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setQuiz({ ...quiz, [name]: value })
    setQuizErrors({ ...quizErrors, [name]: value ? '' : MANDATORY })
  }

  const handleTagsChange = (tags: string[]) => {
    setQuiz({ ...quiz, tags })
    setQuizErrors({ ...quizErrors, tags: tags.length > 0 ? '' : MANDATORY })
  }

  const handleQuestionChange = (question: IQuizQuestion, index: number) => {
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
      toast.error('A quiz must contain at least one question')
      return
    }
    const questions = quiz.questions
    questions.splice(index, 1)
    setQuiz({ ...quiz, questions })

    const questionsErrors = quizErrors.questions
    questionsErrors.splice(index, 1)
    setQuizErrors({ ...quizErrors, questions: questionsErrors })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    const errors = validate(quiz)
    if (errors.isNotEmpty()) {
      setQuizErrors(errors)
      toast.error('Quiz Invalid')
      return
    }

    try {
      setIsSubmitting(true)

      const cleanedQuiz = { ...quiz }
      delete cleanedQuiz.plays

      await onSubmit(cleanedQuiz)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
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
          errors={quizErrors.questions[index] ?? new QuizQuestionErrors()}
          onRemove={handleQuestionRemove}
          onChange={handleQuestionChange}
        />
      ))}

      <SubmitButton className={styles.submit} disabled={isSubmitting} />
    </form>
  )
}

export default QuizForm

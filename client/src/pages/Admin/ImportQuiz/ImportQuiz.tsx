import { INVALID_FILE_FORMAT, MANDATORY } from '@/constants/common'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ImportQuiz.module.css'
import PageTitle from '@/components/PageTitle/PageTitle'
import InputFile from '@/components/InputFile/InputFile'
import SubmitButton from '@/components/Button/SubmitButton'

const ImportQuiz = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState<File>()
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      setError(MANDATORY)
      return
    }
    if (file.type !== 'application/json') {
      setError(INVALID_FILE_FORMAT)
      return
    }
    // HttpClient.import('/quizzes/import', file, 'file').then(() => {
    // ToastService.success(IMPORT_WITH_SUCCESS)
    navigate('/admin/quiz')
    // })
  }

  const handleFileChange = (file: File) => {
    setFile(file)
    setError(file.type !== 'application/json' ? INVALID_FILE_FORMAT : '')
  }

  return (
    <>
      <PageTitle value='Import' />
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputFile type='JSON' error={error} onChange={handleFileChange} />
        <SubmitButton className={styles.submit} />
      </form>
    </>
  )
}

export default ImportQuiz

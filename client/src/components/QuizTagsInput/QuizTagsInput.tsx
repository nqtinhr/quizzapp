import InputError from '../InputError/InputError'
import Label from '../Label/Label'
import styles from './QuizTagsInput.module.css'
import { WithContext as ReactTags } from 'react-tag-input'

type QuizTagsInputProps = {
  label: string
  value: string[]
  error: string
  onChange: (newValue: string[]) => void
}

const QuizTagsInput = ({ label, value, error, onChange }: QuizTagsInputProps) => {
  const toTags = (value: string[]): any[] => {
    return value.map((tag, index) => {
      return {
        id: index + '',
        text: tag
      }
    })
  }

  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleAddition = (tag: any) => {
    onChange([...value, tag.text])
  }

  return (
    <div className={[styles.container, error ? styles.error : ''].join(' ')}>
      <Label>{label}</Label>
      <ReactTags
        placeholder=''
        autofocus={false}
        tags={toTags(value)}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
      />
      <InputError value={error} />
    </div>
  )
}

export default QuizTagsInput

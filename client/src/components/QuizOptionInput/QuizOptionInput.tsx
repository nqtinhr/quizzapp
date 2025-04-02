import styles from './QuizOptionInput.module.css'
import Input from '../Input/Input'
import { Tooltip } from 'react-tooltip'
import { IoMdCheckmark } from 'react-icons/io'
import { SELECT_QUIZ_OPTION } from '@/constants/common'

type QuizOptionInputProps = {
  option: string
  optionIndex: number
  optionError: string
  selectedOptionIndex: number
  onChange: (option: string, index: number) => void
  onSelect: (index: number) => void
}

const QuizOptionInput = ({
  option,
  optionIndex,
  selectedOptionIndex,
  optionError,
  onChange,
  onSelect
}: QuizOptionInputProps) => {
  return (
    <div className={styles.container}>
      <Tooltip id='select-option' />
      <IoMdCheckmark
        className={[styles.select, optionIndex === selectedOptionIndex ? styles.selected : ''].join(' ')}
        data-tooltip-id='select-option'
        data-tooltip-content={SELECT_QUIZ_OPTION}
        onClick={() => onSelect(optionIndex)}
      />
      <Input
        name='option'
        value={option}
        error={optionError}
        onChange={(event) => onChange(event.target.value, optionIndex)}
      />
    </div>
  )
}

export default QuizOptionInput

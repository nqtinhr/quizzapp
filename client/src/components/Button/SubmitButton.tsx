import { SUBMIT } from '@/constants/common'
import Button from './Button'

type SubmitButtonProps = {
  className?: string
  disabled?: boolean
}

const SubmitButton = ({ className, disabled }: SubmitButtonProps) => (
  <Button className={className} type='submit' disabled={disabled}>
    {SUBMIT}
  </Button>
)

export default SubmitButton

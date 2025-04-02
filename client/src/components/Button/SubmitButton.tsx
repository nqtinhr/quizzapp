import { SUBMIT } from '@/constants/common'
import Button from './Button'

type SubmitButtonProps = {
  className?: string
}

const SubmitButton = ({ className }: SubmitButtonProps) => (
  <Button className={className} type='submit'>
    {SUBMIT}
  </Button>
)

export default SubmitButton

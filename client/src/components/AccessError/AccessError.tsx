import { FiUserX } from 'react-icons/fi'
import styles from './AccessError.module.css'
import LoginBtn from '../LoginBtn/LoginBtn'
import { useAppSelector } from '@/redux/store'
import { selectCurrentUser } from '@/redux/userSlice'

type AccessErrorProps = {
  message: string
}

const AccessError = ({ message }: AccessErrorProps) => {
  const currentUser = useAppSelector(selectCurrentUser)

  return (
    <div className={styles.container}>
      <FiUserX className={styles.icon} />
      <p>{message}</p>
      {currentUser && <LoginBtn style='button' />}
    </div>
  )
}

export default AccessError

import { FiUserX } from 'react-icons/fi'
import styles from './AccessError.module.css'
import LoginBtn from '../LoginBtn/LoginBtn'
import { useAppSelector } from '@/redux/store'

type AccessErrorProps = {
  message: string
}

const AccessError = ({ message }: AccessErrorProps) => {
  const currentUser = useAppSelector((state) => state.user.currentUser)

  return (
    <div className={styles.container}>
      <FiUserX className={styles.icon} />
      <p>{message}</p>
      {currentUser && <LoginBtn style='button' />}
    </div>
  )
}

export default AccessError

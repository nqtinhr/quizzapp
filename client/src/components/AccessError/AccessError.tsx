import { FiUserX } from 'react-icons/fi'
import styles from './AccessError.module.css'

type AccessErrorProps = {
  message: string
}

const AccessError = ({ message }: AccessErrorProps) => {
  // const { user } = useUser()

  return (
    <div className={styles.container}>
      <FiUserX className={styles.icon} />
      <p>{message}</p>
      {/* {User.isNotLoggedIn(user) && <Login style='button' />} */}
    </div>
  )
}

export default AccessError

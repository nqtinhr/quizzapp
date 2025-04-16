import styles from './LoginBtn.module.css'
import { Tooltip } from 'react-tooltip'
import { FiLogIn } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { LOGIN_MESSAGE, URL_BEFORE_LOGIN } from '@/constants/common'

type LoginBtnProps = {
  style: 'icon' | 'button'
}

const LoginBtn = ({ style: type }: LoginBtnProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    localStorage.setItem(URL_BEFORE_LOGIN, window.location.pathname)
    navigate('/login')
  }

  const icon = () => (
    <div onClick={handleClick}>
      <Tooltip id='login' />
      <FiLogIn
        data-tooltip-id='login'
        data-tooltip-content={LOGIN_MESSAGE}
        data-tooltip-place='bottom'
        className={styles.icon}
      ></FiLogIn>
    </div>
  )

  const button = () => (
    <button onClick={handleClick} className={styles.button}>
      {LOGIN_MESSAGE}
    </button>
  )

  return type == 'icon' ? icon() : button()
}

export default LoginBtn

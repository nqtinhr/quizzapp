import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useAppSelector } from '@/redux/store'
import Profile from '../Profile/Profile'
import LoginBtn from '../LoginBtn/LoginBtn'

const Navbar = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser)

  return (
    <nav className={styles.navbar}>
      <Link className={styles.logo} to='/'>
        <img src='/logo.svg' alt='Logo' />
      </Link>
      <div className={styles.right}>{currentUser ? <Profile /> : <LoginBtn style='icon' />}</div>
    </nav>
  )
}

export default Navbar

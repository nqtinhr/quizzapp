import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
  // const { user } = useUser()

  return (
    <nav className={styles.navbar}>
      <Link className={styles.logo} to='/'>
        <img src='/logo.svg' alt='Logo' />
      </Link>
      {/* <div className={styles.right}>{User.isNotLoggedIn(user) ? <Login style='icon' /> : <Profile />}</div> */}
    </nav>
  )
}

export default Navbar

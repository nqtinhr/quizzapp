import { useEffect, useState } from 'react'
import { LuHistory, LuLogOut, LuSettings, LuUsers } from 'react-icons/lu'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import AdminLabel from '../Label/AdminLabel'
import styles from './Profile.module.css'
import { LOGOUT_MODAL_BUTTON_LABEL, LOGOUT_MODAL_HEADER, LOGOUT_MODAL_MESSAGE } from '@/constants/common'

const Profile = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  // const { user, setUser } = useUser()
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://avatars.githubusercontent.com/u/32478517?v=4'
  })
  const navigate = useNavigate()

  useEffect(() => {
    document.addEventListener('click', () => setShowDropdown(false))
  }, [])

  const logout = () => {
    // setUser(NOT_LOGGED_IN_USER)
    // UserService.saveUser(NOT_LOGGED_IN_USER)
    // ToastService.success(LOGOUT_WITH_SUCCESS)
    navigate('/')
  }

  const toggleDropdown = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  return (
    <div className={styles.container}>
      <div onClick={toggleDropdown} className={styles.profile}>
        <img className={styles.avatar} src={user.image} alt='Avatar' />
        <span className={styles.email}>{user.email}</span>
        <MdOutlineKeyboardArrowDown className={styles.dropdownIcon} />
      </div>
      <div className={[styles.dropdown, showDropdown ? styles.show : ''].join(' ')}>
        <p className={styles.username}>
          <img className={styles.avatar} src={user.image} alt='Avatar' />
          {user.name}
          <AdminLabel />
        </p>
        {user && (
          <>
            <Link className={styles.menuItem} to='/admin/quiz'>
              <LuSettings className={styles.icon} />
              Quiz
            </Link>
            <Link className={styles.menuItem} to='/admin/users'>
              <LuUsers className={styles.icon} />
              Utilisateurs
            </Link>
          </>
        )}
        <Link className={styles.menuItem} to='/history'>
          <LuHistory className={styles.icon} />
          Historique
        </Link>
        <div className={styles.menuItem} onClick={() => setOpenLogoutModal(true)}>
          <LuLogOut className={styles.icon} />
          Déconnexion
        </div>
      </div>
      <ConfirmModal
        header={LOGOUT_MODAL_HEADER}
        message={LOGOUT_MODAL_MESSAGE}
        isOpen={openLogoutModal}
        setIsOpen={setOpenLogoutModal}
        action={logout}
        actionLabel={LOGOUT_MODAL_BUTTON_LABEL}
      />
    </div>
  )
}

export default Profile

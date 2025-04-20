import { useEffect, useState } from 'react'
import { LuHistory, LuLogOut, LuSettings, LuUsers } from 'react-icons/lu'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import AdminLabel from '../Label/AdminLabel'
import styles from './Profile.module.css'
import {
  HISTORY,
  LOGOUT,
  LOGOUT_MODAL_BUTTON_LABEL,
  LOGOUT_MODAL_HEADER,
  LOGOUT_MODAL_MESSAGE,
  QUIZ,
  USERS
} from '@/constants/common'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { clearUser, selectCurrentUser } from '@/redux/userSlice'
import { logoutUserAPI, selectRefreshToken } from '@/redux/authSlice'
import { toast } from 'react-toastify'

const Profile = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const refreshToken = useAppSelector(selectRefreshToken)

  useEffect(() => {
    document.addEventListener('click', () => setShowDropdown(false))
  }, [])

  const logout = () => {
    dispatch(logoutUserAPI({ refreshToken }))
      .unwrap()
      .then(() => {
        dispatch(clearUser())
        toast.success('Logout successfully')
        setOpenLogoutModal(false)
        navigate('/login')
      })
  }

  const toggleDropdown = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  return (
    <div className={styles.container}>
      <div onClick={toggleDropdown} className={styles.profile}>
        <img className={styles.avatar} src={user?.picture} alt='Avatar' />
        <span className={styles.email}>{user?.email}</span>
        <MdOutlineKeyboardArrowDown className={styles.dropdownIcon} />
      </div>
      <div className={[styles.dropdown, showDropdown ? styles.show : ''].join(' ')}>
        <p className={styles.username}>
          <img className={styles.avatar} src={user?.picture} alt='Avatar' />
          {user?.name}
          <AdminLabel />
        </p>
        {user && (
          <>
            <Link className={styles.menuItem} to='/admin/quiz'>
              <LuSettings className={styles.icon} />
              {QUIZ}
            </Link>
            <Link className={styles.menuItem} to='/admin/users'>
              <LuUsers className={styles.icon} />
              {USERS}
            </Link>
          </>
        )}
        <Link className={styles.menuItem} to='/history'>
          <LuHistory className={styles.icon} />
          {HISTORY}
        </Link>
        <div className={styles.menuItem} onClick={() => setOpenLogoutModal(true)}>
          <LuLogOut className={styles.icon} />
          {LOGOUT}
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

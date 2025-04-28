import { permissions } from '@/config/rbacConfig'
import {
  HISTORY,
  LOGOUT,
  LOGOUT_MODAL_BUTTON_LABEL,
  LOGOUT_MODAL_HEADER,
  LOGOUT_MODAL_MESSAGE,
  QUIZ,
  USERS
} from '@/constants/common'
import { usePermission } from '@/hooks/usePermission'
import { logoutUserAPI, selectRefreshToken } from '@/redux/authSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { clearUser, selectCurrentUser } from '@/redux/userSlice'
import { IRole } from '@/types/role'
import { useEffect, useState } from 'react'
import { LuHistory, LuLogOut, LuSettings, LuUsers } from 'react-icons/lu'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import RoleLabel from '../Label/RoleLabel'
import styles from './Profile.module.css'

const Profile = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const refreshToken = useAppSelector(selectRefreshToken)

  const { hasPermission } = usePermission(user?.role as IRole)

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
        {user?.picture ? (
          <img className={styles.avatar} src={user.picture} alt='Avatar' />
        ) : (
          <div className={styles.fallbackAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        )}
        <span className={styles.email}>{user?.email}</span>
        <MdOutlineKeyboardArrowDown className={styles.dropdownIcon} />
      </div>
      <div className={[styles.dropdown, showDropdown ? styles.show : ''].join(' ')}>
        <p className={styles.username}>
          {user?.picture ? (
            <img className={styles.avatar} src={user.picture} alt='Avatar' />
          ) : (
            <div className={styles.fallbackAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          )}
          {user?.name}
          <RoleLabel />
        </p>

        {user && (
          <>
            {hasPermission(permissions.VIEW_QUIZ) && (
              <Link className={styles.menuItem} to='/admin/quiz'>
                <LuSettings className={styles.icon} />
                {QUIZ}
              </Link>
            )}

            {hasPermission(permissions.VIEW_USER) && (
              <Link className={styles.menuItem} to='/admin/users'>
                <LuUsers className={styles.icon} />
                {USERS}
              </Link>
            )}
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

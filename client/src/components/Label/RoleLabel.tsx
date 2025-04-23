import { useAppSelector } from '@/redux/store'
import { selectCurrentUser } from '@/redux/userSlice'
import styles from './Label.module.css'

const RoleLabel = () => {
  const user = useAppSelector(selectCurrentUser)

  if (!user?.role) return null

  const getLabelStyle = () => {
    switch (user.role.toLowerCase()) {
      case 'admin':
        return styles.admin
      case 'moderator':
        return styles.moderator
      case 'client':
        return styles.client
      default:
        return styles.default
    }
  }

  return <span className={getLabelStyle()}>{user.role}</span>
}

export default RoleLabel

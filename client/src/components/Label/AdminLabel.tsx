import { User } from '@/models/User'
import styles from './Label.module.css'

const AdminLabel = () => {
  // const { user } = useUser();

  return User && <span className={styles.admin}>ADMIN</span>
}

export default AdminLabel

import Link from '@/components/Link/Link'
import { ADMIN_RESERVED_PAGE, GO_TO_HOMEPAGE } from '@/constants/common'
import styles from './NoPage.module.css'

const AccessDenied = () => {
  return (
    <div className={styles.container}>
      <h1>Access Denied</h1>
      <h2>{ADMIN_RESERVED_PAGE}</h2>
      <Link to='/' className={styles.link}>
        {GO_TO_HOMEPAGE}
      </Link>
    </div>
  )
}

export default AccessDenied

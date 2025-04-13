import Link from '@/components/Link/Link'
import styles from './NoPage.module.css'
import { GO_TO_HOMEPAGE, NOT_FOUND_PAGE_TITLE } from '@/constants/common'

const NoPage = () => {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <h2>{NOT_FOUND_PAGE_TITLE}</h2>
      <Link to='/' className={styles.link}>
        {GO_TO_HOMEPAGE}
      </Link>
    </div>
  )
}

export default NoPage

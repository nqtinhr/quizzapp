import { BANNER_BUTTON, BANNER_MESSAGE, BANNER_SUBMESSAGE } from '@/constants/common'
import styles from './Banner.module.css'
import Button from '../Button/Button'

const Banner = () => {
  const scrollViewHeight = () => {
    window.scrollTo(0, window.innerHeight - 60) // 60 = navbar.height
  }

  return (
    <div className={styles.banner}>
      <div className={styles['welcome-message']}>
        <h1>{BANNER_MESSAGE}</h1>
        <p>{BANNER_SUBMESSAGE}</p>
        <Button onClick={scrollViewHeight}>{BANNER_BUTTON}</Button>
      </div>
      <img src='/banner.svg' alt='' />
    </div>
  )
}

export default Banner

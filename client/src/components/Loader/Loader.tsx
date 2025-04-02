import styles from './Loader.module.css'
import { ThreeDots } from 'react-loader-spinner'

type LoaderProps = {
  visible: boolean
}

const Loader = ({ visible }: LoaderProps) => {
  return (
    <div className={styles.container}>
      <ThreeDots visible={visible} height='160' width='160' color='#F0B23A' radius='9' ariaLabel='three-dots-loading' />
    </div>
  )
}

export default Loader

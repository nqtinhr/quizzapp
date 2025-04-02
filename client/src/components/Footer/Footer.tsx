import { ALL_RIGHTS_RESERVED } from '@/constants/common'
import classes from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <p>{ALL_RIGHTS_RESERVED}</p>
    </footer>
  )
}

export default Footer

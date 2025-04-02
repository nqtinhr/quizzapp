import styles from './Link.module.css'
import { Link as LinkReactDom } from 'react-router-dom'

type LinkProps = {
  to: string
  className?: string
  children?: React.ReactNode
}

const Link = ({ className, to, children }: LinkProps) => (
  <LinkReactDom className={[className, styles.link].join(' ')} to={to}>
    {children}
  </LinkReactDom>
)

export default Link

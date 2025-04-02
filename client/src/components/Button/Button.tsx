import styles from './Button.module.css'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const Button = ({ type, className, onClick, children }: ButtonProps) => (
  <button type={type} className={[className, styles.button].join(' ')} onClick={onClick}>
    {children}
  </button>
)

export default Button

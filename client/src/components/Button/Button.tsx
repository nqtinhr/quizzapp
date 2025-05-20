import styles from './Button.module.css'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

const Button = ({ type, className, onClick, disabled, children }: ButtonProps) => (
  <button type={type} className={[className, styles.button].join(' ')} onClick={onClick} disabled={disabled}>
    {children}
  </button>
)

export default Button

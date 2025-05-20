import styles from './Label.module.css'

type LabelProps = {
  className?: string
  children?: React.ReactNode
}

const Label = ({ className, children }: LabelProps) => (
  <label className={[className, styles.label].join(' ')}>{children}</label>
)

export default Label

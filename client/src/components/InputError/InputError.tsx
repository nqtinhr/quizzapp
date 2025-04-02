import styles from './InputError.module.css'

type InputErrorProps = {
  value?: string
}

const InputError = ({ value }: InputErrorProps) => {
  return <p className={styles.container}>{value}</p>
}

export default InputError

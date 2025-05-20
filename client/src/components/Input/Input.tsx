import { ChangeEventHandler } from 'react'
import styles from './Input.module.css'
import Label from '../Label/Label'
import InputError from '../InputError/InputError'

type InputProps = {
  label?: string
  name: string
  value: string
  error: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const Input = ({ label, name, value, error, onChange }: InputProps) => (
  <div className={[styles.container, error ? styles.error : ''].join(' ')}>
    {label && <Label>{label}</Label>}
    <input name={name} value={value} onChange={onChange} />
    <InputError value={error} />
  </div>
)

export default Input

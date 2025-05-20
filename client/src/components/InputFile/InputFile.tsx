import { ChangeEvent, useState } from 'react'
import InputError from '../InputError/InputError'
import styles from './InputFile.module.css'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { ADD_FILE, AUTHORIZED_FILE_FORMAT } from '@/constants/common'

type InputFileProps = {
  type: string
  error: string
  onChange: (file: File) => void
}

const InputFile = ({ type, onChange, error }: InputFileProps) => {
  const [filename, setFilename] = useState('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.item(0)
    if (!file) return
    setFilename(file.name)
    onChange(file)
  }

  return (
    <>
      <div className={[styles.container, error ? styles.error : ''].join(' ')}>
        <IoCloudUploadOutline className={styles.icon} />
        <h3>{filename || ADD_FILE}</h3>
        <p>
          {AUTHORIZED_FILE_FORMAT}
          {type}
        </p>
        <input type='file' onChange={handleFileChange} />
      </div>
      <InputError value={error} />
    </>
  )
}

export default InputFile

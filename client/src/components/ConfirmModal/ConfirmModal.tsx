import styles from './ConfirmModal.module.css'
import Modal from 'react-responsive-modal'
import Button from '../Button/Button'
import { CANCEL } from '@/constants/common'

type ConfirmModalProps = {
  header: string
  message: string
  isOpen: boolean
  setIsOpen: (bool: boolean) => void
  action: () => void
  actionLabel: string
}

const ConfirmModal = ({ header, message, isOpen, setIsOpen, action, actionLabel }: ConfirmModalProps) => {
  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)} center classNames={{ modal: 'modal' }}>
      <h1>{header}</h1>
      <p>{message}</p>
      <div className={styles.actions}>
        <Button className={styles.cancel} onClick={() => setIsOpen(false)}>
          {CANCEL}
        </Button>
        <Button onClick={action}>{actionLabel}</Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal

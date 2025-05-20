import styles from './Button.module.css'
import { Tooltip } from 'react-tooltip'
import { LiaTimesSolid } from 'react-icons/lia'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { useState } from 'react'
import { DELETE, DELETE_CONFIRMATION_MESSAGE } from '@/constants/common'

type DeleteButtonProps = {
  onDelete: () => void
}

const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip id='delete' />
      <LiaTimesSolid
        data-tooltip-id='delete'
        data-tooltip-content={DELETE}
        className={styles.delete}
        onClick={() => setIsOpen(true)}
      ></LiaTimesSolid>
      <ConfirmModal
        header={DELETE}
        message={DELETE_CONFIRMATION_MESSAGE}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={onDelete}
        actionLabel={DELETE}
      />
    </>
  )
}

export default DeleteButton

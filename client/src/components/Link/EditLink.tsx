import styles from './Link.module.css'
import { Tooltip } from 'react-tooltip'
import { Link } from 'react-router-dom'
import { MdEdit } from 'react-icons/md'
import { EDIT } from '@/constants/common'

type EditLinkProps = {
  to: string
}

const EditLink = ({ to }: EditLinkProps) => {
  return (
    <>
      <Tooltip id='edit' />
      <Link data-tooltip-id='edit' data-tooltip-content={EDIT} to={to}>
        <MdEdit className={[styles.action, styles.edit].join(' ')} />
      </Link>
    </>
  )
}

export default EditLink

import PageTitle from '@/components/PageTitle/PageTitle'
import { MANAGE_USERS_PAGE_TITLE, USER_EMAIL, USER_NAME, USER_PROVIDER } from '@/constants/common'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { getUserListAPI } from '@/redux/userSlice'
import { useEffect } from 'react'
import Table from 'react-table-lite'
import styles from './ManageUsers.module.css'
import { IUser } from '@/types/user'

const ManageUsers = () => {
  const dispatch = useAppDispatch()
  const { userList, pagination } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(getUserListAPI({ params: { page: pagination.page, limit: pagination.limit } }))
  }, [dispatch, pagination.page, pagination.limit])

  return (
    <>
      <PageTitle value={MANAGE_USERS_PAGE_TITLE} />
      <Table
        data={userList}
        headers={['name', 'provider', 'email']}
        customHeaders={{ name: USER_NAME, provider: USER_PROVIDER, email: USER_EMAIL }}
        searchBy={['name', 'provider', 'email']}
        searchable={true}
        customRenderCell={{
          name: (user: IUser) => (
            <span className={styles.name}>
              <img src={user.picture} alt='User' />
              {user.name}
            </span>
          ),
          provider: (user: IUser) => (
            <img src={user.picture} alt='avatar' width={40} height={40} style={{ borderRadius: '50%' }} />
          )
        }}
      />
    </>
  )
}

export default ManageUsers

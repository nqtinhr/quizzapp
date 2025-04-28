import PageTitle from '@/components/PageTitle/PageTitle'
import { MANAGE_USERS_PAGE_TITLE, USER_EMAIL, USER_NAME, USER_PROVIDER } from '@/constants/common'
import { User } from '@/models/User'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { getUserListAPI } from '@/redux/userSlice'
import { useEffect } from 'react'
import Table from 'react-table-lite'
import styles from './ManageUsers.module.css'

const ManageUsers = () => {
  const dispatch = useAppDispatch()
  const { userList, pagination } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(getUserListAPI({ params: { page: pagination.page, limit: pagination.limit } }))
  }, [dispatch, pagination.page, pagination.limit])
  console.log("🚀 ~ ManageUsers ~ userList:", userList)

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
          name: (user: User) => (
            <span className={styles.name}>
              <img src={user.picture} alt='User' />
              {user.name}
            </span>
          ),
          provider: (user: User) => <img className={styles.provider} src={user.picture} alt='Provider' />
        }}
      />
    </>
  )
}

export default ManageUsers

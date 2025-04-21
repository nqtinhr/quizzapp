import PageTitle from '@/components/PageTitle/PageTitle'
import { MANAGE_USERS_PAGE_TITLE, USER_EMAIL, USER_NAME, USER_PROVIDER } from '@/constants/common'
import { User } from '@/models/User'
import { useState } from 'react'
import Table from 'react-table-lite'
import styles from './ManageUsers.module.css'

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([])

  // useEffect(() => {
  //   HttpClient.get<User[]>('/users').then((res) => setUsers(res.data))
  // }, [])

  return (
    <>
      <PageTitle value={MANAGE_USERS_PAGE_TITLE} />
      <Table
        data={users}
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

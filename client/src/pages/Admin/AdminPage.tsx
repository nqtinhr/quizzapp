import AccessError from '@/components/AccessError/AccessError'
import { ADMIN_RESERVED_PAGE } from '@/constants/common'
import { User } from '@/models/User'
import { Outlet } from 'react-router-dom'

const AdminPage = () => {
  // const { user } = useUser();

  return User ? <Outlet /> : <AccessError message={ADMIN_RESERVED_PAGE} />
}

export default AdminPage

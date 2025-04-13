import AccessError from '@/components/AccessError/AccessError'
import { LOGGED_IN_RESERVED_PAGE } from '@/constants/common'
import { User } from '@/models/User'
import { Outlet } from 'react-router-dom'

const LoggedInPage = () => {
  // const { user } = useUser();

  return User ? <Outlet /> : <AccessError message={LOGGED_IN_RESERVED_PAGE} />
}

export default LoggedInPage

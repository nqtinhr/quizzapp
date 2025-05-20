import { roles } from '@/config/rbacConfig'
import { usePermission } from '@/hooks/usePermission'
import { useAppSelector } from '@/redux/store'
import { selectCurrentUser } from '@/redux/userSlice'
import { IRole } from '@/types/role'
import { Navigate, Outlet } from 'react-router-dom'

const RbacRoute = ({
  requiredPermission,
  redirectTo = '/access-denied'
}: {
  requiredPermission: string
  redirectTo?: string
}) => {
  const user = useAppSelector(selectCurrentUser)
  const userRole = user?.role || roles.CLIENT

  const { hasPermission } = usePermission(userRole as IRole)

  // Nếu hết hạn token, điều hướng tới trang login
  if (!user) return <Navigate to='/login' replace={true} />

  // Nếu như user không có quyền hạn, điều hướng tới trang Access Denied
  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  // Dùng Outlet (cách này thường dùng cho dự án xài react-router-dom ver mới từ 6.X.x trở lên) hiện đại và dễ bảo trì.
  return <Outlet />

  // Dùng children (cách này thường dùng cho dự án xài react-router-dom ver cũ từ 5.x.x trở xuống)
  // return children
}

export default RbacRoute

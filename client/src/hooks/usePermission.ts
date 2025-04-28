import { rolePermissions } from '@/config/rbacConfig'
import { IRole } from '@/types/role'

export const usePermission = (userRole: IRole): { hasPermission: (permission: string) => boolean } => {
  const hasPermission = (permission: string): boolean => {
    const allowedPermissions = rolePermissions[userRole] || []

    return allowedPermissions.includes(permission)
  }
  return { hasPermission }
}

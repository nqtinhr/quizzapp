// Định nghĩa Roles của user trong hệ thống
export const roles = {
  CLIENT: 'CLIENT',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
}

// Định nghĩa các quyền - Permissions trong hệ thống
export const permissions = {
  VIEW_USER: 'view_user',
  VIEW_HISTORY: 'view_history',
  VIEW_QUIZ: 'view_quiz',
  CREATE_QUIZ: 'create_quiz',
  UPDATE_QUIZ: 'update_quiz',
  DELETE_QUIZ: 'delete_quiz',
  IMPORT_QUIZ: 'import_quiz',
  EXPORT_QUIZ: 'export_quiz',
  PLAY_QUIZ: 'play_quiz'
}

// Kết hợp Roles và Permissions để xác định quyền hạn của user
export const rolePermissions = {
  [roles.CLIENT]: [permissions.VIEW_HISTORY, permissions.PLAY_QUIZ],
  [roles.MODERATOR]: [
    permissions.VIEW_USER,
    permissions.VIEW_HISTORY,
    permissions.VIEW_QUIZ,
    permissions.CREATE_QUIZ,
    permissions.IMPORT_QUIZ,
    permissions.EXPORT_QUIZ,
    permissions.PLAY_QUIZ
  ],
  [roles.ADMIN]: Object.values(permissions) // all permissions
}

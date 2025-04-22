export const MOCK_ROLES = [
  {
    _id: 'role-client-sample-id-12345678',
    name: 'client',
    permissions: ['create_support', 'read_support', 'update_support', 'delete_support'],
    inherits: [] // client không kế thừa permissions
  },
  // moderator
  {
    _id: 'role-moderator-sample-id-12345678',
    name: 'moderator',
    permissions: [
      // messages
      'create_messages',
      'read_messages',
      'update_messages',
      'delete_messages'
    ],
    inherits: ['client'] // moderator sẽ kế thừa lại permissions từ client
  },
  // admin
  {
    _id: 'role-admin-sample-id-12345678',
    name: 'admin',
    permissions: [
      // admin-tools
      'create_admin_tools',
      'read_admin_tools',
      'update_admin_tools',
      'delete_admin_tools'
    ],
    inherits: ['client', 'moderator'] // admin sẽ kế thừa lại permissions từ client và moderator
  }
]

export const MOCK_USER = {
  ID: 'sample-id-12345678',
  EMAIL: 'admin@gmail.com',
  PASSWORD: 'trungquandev@123',
  // User lúc này có thể có nhiều roles, lưu ý nếu bạn muốn dùng cách level 3 này ở phía UI thì
  // phần FE ở bộ RBAC (Front-end role-based access control) trước công phải cập nhật lại cho chuẩn nhé. Vì ở bộ trước thì FE đang
  // xử lý theo cấu trúc mỗi user có một role.
  // ROLES: ['client']
  // ROLES: ['moderator']
  ROLES: ['admin']
  // ROLES: ['client', 'moderator', 'admin']
}

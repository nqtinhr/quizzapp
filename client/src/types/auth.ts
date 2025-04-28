export interface ILogin {
  email: string
  password: string
}

export interface IRegister {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ITokenPayload {
  accessToken: string
  refreshToken: string
}
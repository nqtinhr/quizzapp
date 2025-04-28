import { ILogin, IRefreshToken, IRegister } from '@/types/auth'
import axiosInstance from './axiosIntance'

const authApi = {
  register(data: IRegister) {
    return axiosInstance.post('/auth/register', data)
  },
  login(data: ILogin) {
    return axiosInstance.post('/auth/login', data)
  },
  refreshToken(token: IRefreshToken) {
    return axiosInstance.post('/auth/refresh-token', token)
  },
  logout(token: IRefreshToken) {
    return axiosInstance.post('/auth/logout', token)
  }
}

export default authApi

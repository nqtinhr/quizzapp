import { IPagination } from '@/types/common'
import axiosInstance from './axiosIntance'

const userApi = {
  getProfile() {
    return axiosInstance.get('/users/profile')
  },
  getAllUser(params?: IPagination) {
    return axiosInstance.get('/users', { params })
  }
}

export default userApi

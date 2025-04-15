import axiosInstance from './axiosIntance'

const userApi = {
  getProfile() {
    return axiosInstance.get('/users/profile')
  }
}

export default userApi

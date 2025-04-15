import { interceptorLoadingElements } from '@/utils/formatters'
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 1000 * 60 * 10, // 10 minutes
  withCredentials: true
})

// Interceptor Request: Can thiệp vào giữa những cái request API
axiosInstance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Interceptor Response: Can thiệp vào giữa những cái response nhận về
axiosInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    interceptorLoadingElements(false)
    return response.data
  },
  function (error) {
    interceptorLoadingElements(false)
    return Promise.reject(error)
  }
)

export default axiosInstance

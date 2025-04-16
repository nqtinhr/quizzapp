import { RootState } from '@/redux/store'
import { interceptorLoadingElements } from '@/utils/formatters'
import { Store } from '@reduxjs/toolkit'
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file axiosInstance hiện tại
 * Hiểu đơn giản: Khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi
 * hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore: Store<RootState>
export const injectStore = (mainStore: Store<RootState>) => {
  axiosReduxStore = mainStore
}

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

    // Lấy accessToken từ store.
    const accessToken = axiosReduxStore.getState().auth.accessToken

    if (accessToken) {
      // Cần thêm "Bearer " vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
      // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như: Basic token, Digest token, OAuth token, ....vv
      config.headers.Authorization = `Bearer ${accessToken}`
    }

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
    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
    // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error?.response?.data?.message
    }

    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình – Ngoại trừ mã 410 – GONE phục vụ việc tự động refresh lại token.
    if (error?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

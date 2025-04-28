import { logoutUserAPI, refreshTokenAPI } from '@/redux/authSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { ITokenPayload } from '@/types/auth'
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
// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
let refreshTokenPromise: any = null

// Interceptor Response: Can thiệp vào giữa những cái response nhận về
axiosInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    interceptorLoadingElements(false)
    return response.data
  },
  function (error) {
    const currentRefreshToken = axiosReduxStore.getState().auth.refreshToken

    interceptorLoadingElements(false)

    /* Xử lý Refresh Token tự động */
    // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
    if (error?.response?.status === 401) {
      ;(axiosReduxStore.dispatch as AppDispatch)(logoutUserAPI({ refreshToken: currentRefreshToken }))
    }

    // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequest = error.config
    console.log('originalRequest: ', originalRequest)
    if (error.response?.status === 410 && !originalRequest._retry) {
      // Cần thêm một giá trị _retry = true trong khoảng thời gian chờ, đảm bảo việc refresh token này
      // chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn tại điều kiện if ngay phía trên)
      originalRequest._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = (axiosReduxStore.dispatch as AppDispatch)(
          refreshTokenAPI({ refreshToken: currentRefreshToken })
        )
          .unwrap()
          .then((data) => {
            // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
            return {
              accessToken: data?.accessToken,
              refreshToken: data?.refreshToken
            }
          })
          .catch((_error) => {
            console.log('❌ Refresh token thất bại')
            const latestRefreshToken = axiosReduxStore.getState().auth.refreshToken
            // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
            ;(axiosReduxStore.dispatch as AppDispatch)(logoutUserAPI({ refreshToken: latestRefreshToken }))
            return Promise.reject(_error)
          })
          .finally(() => {
            // DÙ API có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
      return refreshTokenPromise.then((data: ITokenPayload) => {
        const { accessToken, refreshToken } = data
        console.log(`🚀 ~ TokenPayload:`, { accessToken, refreshToken })
        /**
         * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào Localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
         * Ví dụ: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
         * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
         */

        // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
        return axiosInstance(originalRequest)
      })
    }
    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
    // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
    let errorMessage = error?.message
    const responseMessage = error?.response?.data?.message

    if (responseMessage) {
      if (Array.isArray(responseMessage)) {
        errorMessage = responseMessage.map((item) => item.error).join(', ')
      } else if (typeof responseMessage === 'string') {
        errorMessage = responseMessage
      }
    }

    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình – Ngoại trừ mã 410 – GONE phục vụ việc tự động refresh lại token.
    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

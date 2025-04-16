import authApi from '@/api/authApi'
import { ILogin, IRefreshToken } from '@/types/IAuth'
import { createAsyncThunk, createSlice, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'

export interface AuthState {
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: ''
}

export const loginUserAPI = createAsyncThunk<AxiosResponse<AuthState>, ILogin, { rejectValue: string }>(
  'auth/loginUserAPI',
  async (data: ILogin) => {
    const result = await authApi.login(data)
    return result
  }
)

export const refreshTokenAPI = createAsyncThunk<AxiosResponse<AuthState>, IRefreshToken, { rejectValue: string }>(
  'auth/refreshTokenAPI',
  async (token: IRefreshToken) => {
    const result = await authApi.refreshToken(token)
    return result
  }
)

export const logoutUserAPI = createAsyncThunk<AxiosResponse<void>, IRefreshToken, { rejectValue: string }>(
  'auth/logoutUserAPI',
  async (token: IRefreshToken) => {
    const result = await authApi.logout(token)
    return result
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action: PayloadAction<AxiosResponse<AuthState>>) => {
        const { accessToken, refreshToken } = action.payload.data
        state.accessToken = accessToken
        state.refreshToken = refreshToken
      })

      .addCase(refreshTokenAPI.fulfilled, (state, action: PayloadAction<AxiosResponse<AuthState>>) => {
        const { accessToken, refreshToken } = action.payload.data
        state.accessToken = accessToken
        state.refreshToken = refreshToken
      })

      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.accessToken = ''
        state.refreshToken = ''
      })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được
// export const {} = authSlice.reducers

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong
// kho redux store ra sử dụng

export const authReducer = authSlice.reducer

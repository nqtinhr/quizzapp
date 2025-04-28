import authApi from '@/api/authApi'
import { ILogin, IRefreshToken } from '@/types/auth'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: ''
}

export const loginUserAPI = createAsyncThunk<AuthState, ILogin>('auth/loginUserAPI', async (data: ILogin) => {
  const result = await authApi.login(data)
  return result.data
})

export const refreshTokenAPI = createAsyncThunk<AuthState, IRefreshToken>(
  'auth/refreshTokenAPI',
  async (token: IRefreshToken) => {
    const result = await authApi.refreshToken(token)
    return result.data
  }
)

export const logoutUserAPI = createAsyncThunk<void, IRefreshToken>(
  'auth/logoutUserAPI',
  async (token: IRefreshToken) => {
    await authApi.logout(token)
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
      .addCase(loginUserAPI.fulfilled, (state, action: PayloadAction<AuthState>) => {
        const { accessToken, refreshToken } = action.payload
        state.accessToken = accessToken
        state.refreshToken = refreshToken
      })

      .addCase(refreshTokenAPI.fulfilled, (state, action: PayloadAction<AuthState>) => {
        const { accessToken, refreshToken } = action.payload
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
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken

export const authReducer = authSlice.reducer

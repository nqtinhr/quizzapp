import userApi from '@/api/userApi'
import { IPagination, IResponse } from '@/types/common'
import { IUser } from '@/types/user'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  userList: IUser[]
  loading: boolean
  currentUser: IUser | null
  pagination: {
    page: number
    limit: number
    totalRows: number
  }
}

const initialState: UserState = {
  userList: [],
  loading: false,
  currentUser: null,
  pagination: {
    page: 1,
    limit: 9,
    totalRows: 0
  }
}

export const profileAPI = createAsyncThunk<IUser, void>('user/profileAPI', async () => {
  const result = await userApi.getProfile()
  return result.data
})

export const getUserListAPI = createAsyncThunk<IResponse<IUser[]>, { params?: IPagination }>(
  'user/getUserListAPI',
  async ({ params }) => {
    const result = await userApi.getAllUser(params)
    return result as unknown as IResponse<IUser[]>
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder
      .addCase(profileAPI.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.currentUser = action.payload
      })
      .addCase(getUserListAPI.fulfilled, (state, action: PayloadAction<IResponse<IUser[]>>) => {
        state.userList = action.payload.data
        state.pagination = action.payload.pagination
        state.loading = false
      })
      .addCase(getUserListAPI.rejected, (state) => {
        state.loading = false
      })
  }
})

export const { clearUser } = userSlice.actions
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser

export const userReducer = userSlice.reducer

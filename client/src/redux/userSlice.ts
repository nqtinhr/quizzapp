import userApi from '@/api/userApi'
import { IUser } from '@/types/IUser'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  userList: IUser[]
  loading: boolean
  currentUser: IUser | null
}

const initialState: UserState = {
  userList: [],
  loading: false,
  currentUser: null
}

export const profileAPI = createAsyncThunk<IUser, void>('user/profileAPI', async () => {
  const result = await userApi.getProfile()
  return result.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder.addCase(profileAPI.fulfilled, (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload
    })
  }
})

export const { clearUser } = userSlice.actions
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser

export const userReducer = userSlice.reducer

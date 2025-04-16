import userApi from '@/api/userApi'
import { IUser } from '@/types/IUser'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  currentUser: IUser | null
}

const initialState: UserState = {
  currentUser: null
}

export const profileAPI = createAsyncThunk<IUser, void, { rejectValue: string }>(
  'user/profileAPI',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userApi.getProfile()
      return result.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Something went wrong')
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder.addCase(profileAPI.fulfilled, (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload
    })
  }
})

export const userReducer = userSlice.reducer

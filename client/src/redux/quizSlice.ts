import quizApi from '@/api/quizApi'
import { IPagination, IResponse } from '@/types/IPagination'
import { IQuiz } from '@/types/IQuiz'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface QuizState {
  quizzes: IQuiz[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    totalRows: number
  }
}

const initialState: QuizState = {
  quizzes: [],
  loading: true,
  pagination: {
    page: 1,
    limit: 10,
    totalRows: 0
  }
}

export const quizListAPI = createAsyncThunk<IResponse<IQuiz[]>, { params?: IPagination }>(
  'quiz/quizListAPI',
  async ({ params }) => {
    const result = await quizApi.getQuizList(params) 
    return result
  }
)

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(quizListAPI.fulfilled, (state, action: PayloadAction<IResponse<IQuiz[]>>) => {
        state.quizzes = action.payload.data
        state.pagination = action.payload.pagination
        state.loading = false
      })
      .addCase(quizListAPI.rejected, (state) => {
        state.loading = false
      })
  }
})

export const quizReducer = quizSlice.reducer

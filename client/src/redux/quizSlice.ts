import quizApi from '@/api/quizApi'
import { IPagination, IResponse } from '@/types/common'
import { IQuiz } from '@/types/quiz'
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
    limit: 9,
    totalRows: 0
  }
}

export const quizListAPI = createAsyncThunk<IResponse<IQuiz[]>, { params?: IPagination }>(
  'quiz/quizListAPI',
  async ({ params }) => {
    const result = await quizApi.getQuizList(params)
    return result as unknown as IResponse<IQuiz[]>
  }
)

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    removeQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload)
      state.pagination.totalRows -= 1
    }
  },
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

export const { removeQuiz } = quizSlice.actions
export const quizReducer = quizSlice.reducer

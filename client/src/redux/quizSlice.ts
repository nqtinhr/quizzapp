import quizApi from '@/api/quizApi'
import { IPagination, IResponse } from '@/types/common'
import { IQuiz, IQuizPlay } from '@/types/quiz'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface QuizState {
  quizzes: IQuiz[]
  quizPlays: IQuizPlay[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    totalRows: number
  }
}

const initialState: QuizState = {
  quizzes: [],
  quizPlays: [],
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

export const historyQuizPlaysAPI = createAsyncThunk<IResponse<IQuizPlay[]>, { params?: IPagination }>(
  'quiz/historyQuizPlaysAPI',
  async ({ params }) => {
    const result = await quizApi.historyQuizPlays(params)
    return result as unknown as IResponse<IQuizPlay[]>
  }
)

export const historyAllQuizPlaysAPI = createAsyncThunk<IResponse<IQuizPlay[]>, { params?: IPagination }>(
  'quiz/historyAllQuizPlaysAPI',
  async ({ params }) => {
    const result = await quizApi.historyAllQuizPlays(params)
    return result as unknown as IResponse<IQuizPlay[]>
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
      .addCase(historyQuizPlaysAPI.fulfilled, (state, action: PayloadAction<IResponse<IQuizPlay[]>>) => {
        state.quizPlays = action.payload.data
        state.pagination = action.payload.pagination
        state.loading = false
      })
      .addCase(historyQuizPlaysAPI.rejected, (state) => {
        state.loading = false
      })
      .addCase(historyAllQuizPlaysAPI.fulfilled, (state, action: PayloadAction<IResponse<IQuizPlay[]>>) => {
        state.quizPlays = action.payload.data
        state.pagination = action.payload.pagination
        state.loading = false
      })
      .addCase(historyAllQuizPlaysAPI.rejected, (state) => {
        state.loading = false
      })
  }
})

export const { removeQuiz } = quizSlice.actions

export const selectQuizes = (state: { quiz: Omit<QuizState, 'quizPlays'> }) => state.quiz.quizzes
export const selectQuizPlays = (state: { quiz: Omit<QuizState, 'quizzes'> }) => state.quiz.quizPlays
export const selectLoading = (state: { quiz: Omit<QuizState, 'pagination'> }) => state.quiz.loading
export const selectPagination = (state: { quiz: Omit<QuizState, 'loading'> }) => state.quiz.pagination

export const quizReducer = quizSlice.reducer

import quizApi from '@/api/quizApi'
import { IQuiz } from '@/types/IQuiz'
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface QuizState {
  quizzes: IQuiz[]
  loading: boolean
}

const initialState: QuizState = {
  quizzes: [],
  loading: true
}

export const quizListAPI = createAsyncThunk<IQuiz[], void>('quiz/quizListAPI', async () => {
  const result = await quizApi.getQuizList()
  return result.data
})

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<QuizState>) => {
    builder.addCase(quizListAPI.fulfilled, (state, action: PayloadAction<IQuiz[]>) => {
      state.quizzes = action.payload
      state.loading = false
    })
  }
})


export const quizReducer = quizSlice.reducer

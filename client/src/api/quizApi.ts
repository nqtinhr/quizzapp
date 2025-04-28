import { IPagination } from '@/types/common'
import { IQuiz } from '@/types/quiz'
import axiosInstance from './axiosIntance'

const quizApi = {
  getQuizList(params?: IPagination) {
    return axiosInstance.get('/quizes', { params })
  },
  getQuiz(id: string) {
    return axiosInstance.get(`/quizes/${id}`)
  },
  createQuiz(quiz: IQuiz) {
    return axiosInstance.post('/quizes', quiz)
  },
  updateQuiz(id: string, quiz: IQuiz) {
    return axiosInstance.patch(`/quizes/${id}`, quiz)
  },
  deleteQuiz(id: string) {
    return axiosInstance.delete(`/quizes/${id}`)
  },
  playQuiz(id: string) {
    return axiosInstance.post(`/quizes/${id}/plays`)
  },
  historyQuiz() {
    return axiosInstance.get('/quizzeshistory/plays')
  }
}

export default quizApi

import { IPagination } from '@/types/common'
import { IQuiz } from '@/types/quiz'
import axiosInstance from './axiosIntance'

const quizApi = {
  getQuizList(params?: IPagination) {
    return axiosInstance.get('/quizzes', { params })
  },
  getQuiz(id: string) {
    return axiosInstance.get(`/quizzes/${id}`)
  },
  createQuiz(quiz: IQuiz) {
    return axiosInstance.post('/quizzes', quiz)
  },
  updateQuiz(id: string, quiz: IQuiz) {
    return axiosInstance.patch(`/quizzes/${id}`, quiz)
  },
  deleteQuiz(id: string) {
    return axiosInstance.delete(`/quizzes/${id}`)
  },
  playQuiz(id: string, correctQuestionsNumber: number) {
    return axiosInstance.post(`/quizzes/${id}/plays`, { correctQuestionsNumber })
  },
  historyQuizPlays(params?: IPagination) {
    return axiosInstance.get('/quizzes/history/plays', { params })
  },
  historyAllQuizPlays(params?: IPagination) {
    return axiosInstance.get('/quizzes/history/all', { params })
  },
  importQuiz(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post('/quizzes/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  exportQuizzes() {
    return axiosInstance.get('/quizzes/export/all', { responseType: 'blob' })
  }
}

export default quizApi

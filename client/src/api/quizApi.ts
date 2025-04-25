import { IPagination } from '@/types/IPagination'
import axiosInstance from './axiosIntance'

const quizApi = {
  getQuizList(params?: IPagination) {
    return axiosInstance.get('/quizes', { params })
  },
  getQuiz(id: string) {
    return axiosInstance.get(`/quizes/${id}`)
  }
}

export default quizApi

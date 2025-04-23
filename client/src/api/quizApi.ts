import axiosInstance from './axiosIntance'

const quizApi = {
  getQuizList() {
    return axiosInstance.get('/quizes')
  },
  getQuiz(id: string) {
    return axiosInstance.get(`/quizes/${id}`)
  }
}

export default quizApi

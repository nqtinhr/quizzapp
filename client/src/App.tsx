import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import AddQuiz from './pages/Admin/AddQuiz/AddQuiz'
import AdminPage from './pages/Admin/AdminPage'
import ImportQuiz from './pages/Admin/ImportQuiz/ImportQuiz'
import ManageQuizzes from './pages/Admin/ManageQuizzes/ManageQuizzes'
import ManageUsers from './pages/Admin/ManageUsers/ManageUsers'
import UpdateQuiz from './pages/Admin/UpdateQuiz/UpdateQuiz'
import History from './pages/History/History'
import Home from './pages/Home/Home'
import Layout from './pages/Layout'
import Login from './pages/Login/Login'
import NoPage from './pages/NoPage/NoPage'
import PlayQuiz from './pages/PlayQuiz/PlayQuiz'
import { IUser } from './types/IUser'
import { useAppDispatch, useAppSelector } from './redux/store'
import { useEffect } from 'react'
import { profileAPI } from './redux/userSlice'

const ProtectedRoute = ({ user }: { user: IUser | null }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}
function App() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.user.currentUser)
  console.log("🚀 ~ App ~ currentUser:", currentUser)
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  useEffect(() => {
    if (accessToken) {
      dispatch(profileAPI())
    }
  }, [accessToken, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route element={<AdminPage />}>
            <Route path='/admin/quiz' element={<ManageQuizzes />} />
            <Route path='/admin/quiz/import' element={<ImportQuiz />} />
            <Route path='/admin/quiz/add' element={<AddQuiz />} />
            <Route path='/admin/quiz/edit/:id' element={<UpdateQuiz />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>
          <Route element={<ProtectedRoute user={currentUser} />}>
            <Route path='/quiz/:id' element={<PlayQuiz />} />
            <Route path='/history' element={<History />} />
          </Route>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

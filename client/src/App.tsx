import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import AddQuiz from './pages/Dashboard/AddQuiz/AddQuiz'
import ImportQuiz from './pages/Dashboard/ImportQuiz/ImportQuiz'
import ManageQuizzes from './pages/Dashboard/ManageQuizzes/ManageQuizzes'
import ManageUsers from './pages/Dashboard/ManageUsers/ManageUsers'
import UpdateQuiz from './pages/Dashboard/UpdateQuiz/UpdateQuiz'
import History from './pages/History/History'
import Home from './pages/Home/Home'
import Layout from './pages/Layout'
import Login from './pages/Login/Login'
import NoPage from './pages/NoPage/NoPage'
import PlayQuiz from './pages/PlayQuiz/PlayQuiz'
import { IUser } from './types/IUser'
import { useAppDispatch, useAppSelector } from './redux/store'
import { useEffect, useRef } from 'react'
import { profileAPI, selectCurrentUser } from './redux/userSlice'
import { selectAccessToken } from './redux/authSlice'
import Dashboard from './pages/Dashboard/Dashboard'

const ProtectedRoute = ({ user }: { user: IUser | null }) => {
  if (!user) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}
function App() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  const accessToken = useAppSelector(selectAccessToken)
  const calledProfileRef = useRef(false)

  useEffect(() => {
    if (accessToken && !currentUser && !calledProfileRef.current) {
      dispatch(profileAPI())
      calledProfileRef.current = true
    }
  }, [accessToken, currentUser, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route element={<Dashboard />}>
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

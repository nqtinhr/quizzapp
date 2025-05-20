import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { permissions } from './config/rbacConfig'
import AddQuiz from './pages/Dashboard/AddQuiz/AddQuiz'
import ImportQuiz from './pages/Dashboard/ImportQuiz/ImportQuiz'
import ManageQuizzes from './pages/Dashboard/ManageQuizzes/ManageQuizzes'
import ManageUsers from './pages/Dashboard/ManageUsers/ManageUsers'
import RbacRoute from './pages/Dashboard/RbacRoute'
import UpdateQuiz from './pages/Dashboard/UpdateQuiz/UpdateQuiz'
import History from './pages/History/History'
import Home from './pages/Home/Home'
import Layout from './pages/Layout'
import Login from './pages/Login/Login'
import AccessDenied from './pages/NoPage/AccessDenied'
import NoPage from './pages/NoPage/NoPage'
import PlayQuiz from './pages/PlayQuiz/PlayQuiz'
import { selectAccessToken } from './redux/authSlice'
import { useAppDispatch, useAppSelector } from './redux/store'
import { profileAPI, selectCurrentUser } from './redux/userSlice'
import { IUser } from './types/user'

const ProtectedRoute = ({ user }: { user: IUser | null }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const UnauthorizedRoute = ({ user }: { user: IUser | null }) => {
  if (user) return <Navigate to='/' replace={true} />
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
    } else {
      calledProfileRef.current = false
    }
  }, [accessToken, currentUser, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route element={<UnauthorizedRoute user={currentUser} />}>
            <Route path='/login' element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute user={currentUser} />}>
            <Route path='/quiz/:id' element={<PlayQuiz />} />
            <Route path='/history' element={<History />} />
          </Route>

          <Route element={<RbacRoute requiredPermission={permissions.VIEW_QUIZ} />}>
            <Route path='/admin/quiz' element={<ManageQuizzes />} />
          </Route>
          <Route element={<RbacRoute requiredPermission={permissions.IMPORT_QUIZ} />}>
            <Route path='/admin/quiz/import' element={<ImportQuiz />} />
          </Route>
          <Route element={<RbacRoute requiredPermission={permissions.CREATE_QUIZ} />}>
            <Route path='/admin/quiz/add' element={<AddQuiz />} />
          </Route>
          <Route element={<RbacRoute requiredPermission={permissions.UPDATE_QUIZ} />}>
            <Route path='/admin/quiz/edit/:id' element={<UpdateQuiz />} />
          </Route>
          <Route element={<RbacRoute requiredPermission={permissions.VIEW_USER} />}>
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>

          <Route index element={<Home />} />
          <Route path='/access-denied' element={<AccessDenied />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

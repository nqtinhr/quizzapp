import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminPage from './pages/Admin/AdminPage'
import Layout from './pages/Layout'
import ManageUsers from './pages/Admin/ManageUsers/ManageUsers'
import UpdateQuiz from './pages/Admin/UpdateQuiz/UpdateQuiz'
import AddQuiz from './pages/Admin/AddQuiz/AddQuiz'
import ImportQuiz from './pages/Admin/ImportQuiz/ImportQuiz'
import ManageQuizzes from './pages/Admin/ManageQuizzes/ManageQuizzes'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import NoPage from './pages/NoPage/NoPage'

function App() {
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
          {/* <Route element={<LoggedInPage />}>
            <Route path='/quiz/:id' element={<PlayQuiz />} />
            <Route path='/history' element={<History />} />
          </Route> */}
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

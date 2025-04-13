import 'react-toastify/dist/ReactToastify.css'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'

const Layout = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout

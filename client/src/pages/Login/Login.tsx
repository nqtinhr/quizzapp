import { loginUserAPI } from '@/redux/authSlice'
import styles from './Login.module.css'
// import { FcGoogle } from 'react-icons/fc'
// import { RxGithubLogo } from 'react-icons/rx'
import { LOGIN_PAGE_TITLE } from '@/constants/common'
import { useAppDispatch } from '@/redux/store'
import { useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast
      .promise(dispatch(loginUserAPI({ email, password })), {
        pending: 'Logging in...'
      })
      .then((res: any) => {
        if (!res.error) navigate('/')
      })
  }

  return (
    <div className={styles.container}>
      <CgProfile className={styles.icon} />
      <h1>{LOGIN_PAGE_TITLE}</h1>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type='submit' className={`${styles.submitButton} interceptor-loading`}>
          {LOGIN_PAGE_TITLE}
        </button>
      </form>
      {/* <div className={styles.signinOptions}>
        <button onClick={() => login('google')} className={styles.signinOption}>
          <FcGoogle className={styles.signinOptionIcon} />
          {LOGIN_WITH_GOOGLE}
        </button>
        <button onClick={() => login('github')} className={styles.signinOption}>
          <RxGithubLogo className={styles.signinOptionIcon} />
          {LOGIN_WITH_GITHUB}
        </button>
      </div> */}
    </div>
  )
}

export default Login

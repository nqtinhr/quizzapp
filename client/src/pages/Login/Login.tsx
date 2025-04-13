import styles from './Login.module.css'
import { FcGoogle } from 'react-icons/fc'
import { RxGithubLogo } from 'react-icons/rx'
import { CgProfile } from 'react-icons/cg'
import { LOGIN_PAGE_TITLE, LOGIN_WITH_GITHUB, LOGIN_WITH_GOOGLE } from '@/constants/common'
import { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = (provider: string) => {
    window.location.href = `/` // thay bằng logic auth thực tế
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gọi API đăng nhập với email và password
    console.log('Logging in with:', { email, password })
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
        <button type='submit' className={styles.submitButton}>
          Đăng nhập
        </button>
      </form>
      <div className={styles.signinOptions}>
        <button onClick={() => login('google')} className={styles.signinOption}>
          <FcGoogle className={styles.signinOptionIcon} />
          {LOGIN_WITH_GOOGLE}
        </button>
        <button onClick={() => login('github')} className={styles.signinOption}>
          <RxGithubLogo className={styles.signinOptionIcon} />
          {LOGIN_WITH_GITHUB}
        </button>
      </div>
    </div>
  )
}

export default Login

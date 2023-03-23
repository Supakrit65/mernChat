import { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

function RegisterAndLoginForm () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext)

  async function submitHandler (e) {
    e.preventDefault()
    const url = isLoginOrRegister === 'register' ? 'register' : 'login'
    try {
      const response = await axios.post(`/${url}`, { username, password })
      setLoggedInUsername(username)
      setId(response.data.id)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='relative flex min-h-screen flex-col item-center justify-center bg-gray-600 py-6 sm:py-12'>
      <form
        className='relative bg-slate-300 px-12 pt-16 pb-14 shadow-xl ring-1
       ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-20'
        onSubmit={submitHandler}
      >
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          type='text'
          placeholder='username'
          className='block rounded w-full mb-6 py-3 border pr-10 pl-4 text-lg'
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type='password'
          placeholder='password'
          className='block rounded w-full mb-6 py-3 border pr-10 pl-4 text-lg'
        />
        <button className='bg-blue-700 block text-slate-100 rounded-full w-full hover:bg-blue-900 py-3 text-lg'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className='text-center text-md mt-3 text-gray-700'>
          {isLoginOrRegister === 'register' && (
            <div>
              Already have an account?
              <button
                onClick={() => setIsLoginOrRegister('login')}
                className='underline text-lg ml-1'
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Don't have an account?
              <button
                onClick={() => setIsLoginOrRegister('register')}
                className='underline text-lg ml-1'
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default RegisterAndLoginForm

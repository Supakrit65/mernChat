import { useState } from 'react'
import axios from 'axios'

function Register () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function registerUser (e) {
    e.preventDefault()
    try {
      const response = await axios.post('/register/', { username, password })
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
       onSubmit={registerUser}
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
          Register
        </button>
      </form>
    </div>
  )
}

export default Register;
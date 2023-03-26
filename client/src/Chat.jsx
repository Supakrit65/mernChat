import React from 'react'

function Chat () {
  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-1 flex'>
        <div className='w-1/3 h-full bg-green-600 p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-white font-bold text-lg'>Chat List</h2>
            <span className='text-white'>Active Person</span>
          </div>
          <div className='bg-white p-2 rounded-lg'>
            <ul>
              <li className='flex items-center space-x-2'> 
                <img
                  src='https://picsum.photos/id/237/50/50'
                  alt='avatar'
                  className='rounded-full'
                />
                <div>
                  <h3 className='font-bold'>John Doe</h3>
                  <p className='text-gray-600 text-sm'>Hello there</p>
                </div>
              </li>
              <li className='flex items-center space-x-2'>
                <img
                  src='https://picsum.photos/id/238/50/50'
                  alt='avatar'
                  className='rounded-full'
                />
                <div>
                  <h3 className='font-bold'>Jane Doe</h3>
                  <p className='text-gray-600 text-sm'>Hi, how are you?</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className='w-2/3 h-full bg-gray-100 p-4'>
          <div className='flex flex-col h-full'>
            <div className='flex-grow overflow-y-scroll'>
              Message with selected person
            </div>
            <div className='flex gap-2'>
              <input
                type='text'
                className='bg-white border p-2 flex-grow'
                placeholder='Type your message here'
              />
              <button className='bg-sky-500/75 rounded-lg p-2 text-cyan-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat

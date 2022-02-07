import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import UserContext from '../context/context'

type FormData = {
  email: string
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const userLoginContext = useContext(UserContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const decodedResponse = await response.json()
      if (decodedResponse.status === 401) {
        alert('Invalid Email / Password, please try again')
      } else {
        localStorage.setItem('token', decodedResponse.token)
        userLoginContext.setLoginState(true)
        router.push('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center items-center w-full  mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" px-10 pt-8 rounded-xl w-screen shadow-md max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Email</label>
              <input
                type="text"
                className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full"
                {...register('email')}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Password</label>
              <input
                type="password"
                className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full"
                {...register('password')}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">
              LOGIN
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

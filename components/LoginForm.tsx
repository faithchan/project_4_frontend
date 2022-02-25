import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import globalContext from '../context/context'

type FormData = {
  email: string
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const { setLogin } = useContext(globalContext)

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
        setLogin(true)
        router.push('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  function validateEmail(email: any) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  return (
    <div className="flex justify-center items-center w-full  mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" px-10 pt-8 rounded-xl w-screen max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Email</label>
              <input
                type="text"
                className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full"
                {...register('email', { required: true, validate: validateEmail })}
              />
              {errors.email && errors.email.type === 'validate' && (
                <div className="text-white">Please enter a valid email address</div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-gray-300 font-semibold">Password</label>
              <input
                type="password"
                className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full"
                {...register('password')}
              />
              {errors.password && (
                <div className="text-white">Please do not leave this field blank</div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
              type="submit"
            >
              LOGIN
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

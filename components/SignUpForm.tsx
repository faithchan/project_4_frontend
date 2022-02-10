import { useForm } from 'react-hook-form'
import Link from 'next/link'

type FormData = {
  username: string
  email: string
  password: string
  walletAddress: string
}

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: any) => {
    console.log('data: ', data)
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      const { email, username, walletAddress } = res.keyValue
      if (email) {
        console.log('duplicate email')
        alert('This email address has already been used. Please try another.')
        return
      }
      if (username) {
        console.log('duplicate username')
        alert('This username has already been used. Please try another.')
        return
      }
      if (walletAddress) {
        console.log('duplicate wallet address')
        alert('This wallet address has already been used. Please try another.')
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  // function validateEmail(email: any) {
  //   const re =
  //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //   return re.test(String(email).toLowerCase())
  // }

  return (
    <div className="flex justify-center items-center w-full  mt-4 mb-32">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" px-10 pt-8 rounded-xl w-screen shadow-md max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block mb-1 md:text-sm text-xs text-white font-body">Username</label>
              <input
                type="text"
                className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full mt-2"
                {...register('username')}
              />
              {errors.username?.type === 'required' && 'Username is required'}
            </div>
            <div>
              <label className="block mb-1 md:text-sm text-xs text-white font-body">Email</label>
              <input
                type="text"
                className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                {...register('email')}
              />
            </div>
            <div>
              <label className="block mb-1 md:text-sm text-xs text-white font-body">Password</label>
              <input
                type="password"
                className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                {...register('password')}
              />
            </div>
            <div>
              <label className="block mb-1 md:text-sm text-xs text-white font-body">Metamask Wallet</label>
              <input
                type="text"
                className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                {...register('walletAddress')}
              />
            </div>
            
            <div className="">
          <label className="md:text-sm text-xs text-white font-body tracking-wider">
            Upload Profile Photo
          </label>
          <div className="flex items-center justify-center w-full mt-2">
            <label className="flex flex-col border-2 border-dashed w-full rounded-lg h-32 group">
              <div className="flex flex-col items-center justify-center pt-7 cursor-pointer">
                <svg
                  className="w-10 h-10 text-purple-400 group-hover:text-purple-600"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="lowercase text-sm text-white group-hover:text-purple-600 pt-1 tracking-wider">
                  Select a photo
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpeg,.jpg,.png,.gif"
              
              />
            </label>
          </div>
        </div>

          </div>
          <div className="flex justify-center">
            <Link href="/login">
              <button className=" border-2 border-gold hover:bg-blue-450 text-gold font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8 mr-4">
                LOGIN
              </button>
            </Link>
            <button className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm

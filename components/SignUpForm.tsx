import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { create } from 'ipfs-http-client'
const url: string | any = 'https://ipfs.infura.io:5001/api/v0'
const client = create(url)

type FormData = {
  username: string
  email: string
  password: string
  walletAddress: string
  avatar: string
}

const SignUpForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      avatar:
        'https://bafkreigj5xab3lrgu7nty4r2sqwbfqkudeed7pz2w7fvajnflgphyw6nlu.ipfs.infura-ipfs.io/',
    },
  })

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
      console.log('response:', res)
      const { username, email, walletAddress } = res.keyValue
      if (username) {
        alert('Username already registered')
      }
      if (email) {
        alert('Email already registered')
      }
      if (walletAddress) {
        alert('Wallet address already registered')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onFileUpload = async (e: any) => {
    const file = e.target.files[0]
    try {
      console.log(`adding ${file.name} to ipfs....`)
      const { cid } = await client.add(
        { content: file },
        {
          cidVersion: 1,
          hashAlg: 'sha2-256',
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${cid}`
      console.log('ipfs url: ', url)
      setValue('avatar', url)
    } catch (e) {
      console.error('Error uploading file: ', e)
    }
  }

  const validateAddress = (input: string) => {
    const prefix = input.slice(0, 2)
    if (input.length === 42 && prefix === '0x') {
      return true
    }
    return false
  }

  function validateEmail(email: any) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  return (
    <div className="flex justify-center items-center w-full  mt-4 mb-32">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className=" px-10 pt-8 rounded-xl w-screen shadow-md max-w-sm">
            <div className="space-y-6">
              <div>
                <label className="block mb-1 md:text-sm text-xs text-white font-body">
                  Username
                </label>
                <input
                  type="text"
                  className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full mt-2"
                  {...register('username', { required: true })}
                />
                {errors.username && (
                  <div className="text-white">Please do not leave this field blank</div>
                )}
              </div>
              <div>
                <label className="block mb-1 md:text-sm text-xs text-white font-body">Email</label>
                <input
                  type="text"
                  className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                  {...register('email', { required: true, validate: validateEmail })}
                />
                {errors.email && errors.email.type === 'validate' && (
                  <div className="text-white">Please enter a valid email address</div>
                )}
              </div>
              <div>
                <label className="block mb-1 md:text-sm text-xs text-white font-body">
                  Password
                </label>
                <input
                  type="password"
                  className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <div className="text-white">Please do not leave this field blank</div>
                )}
              </div>
              <div>
                <label className="block mb-1 md:text-sm text-xs text-white font-body">
                  Metamask Wallet
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full mt-2"
                  {...register('walletAddress', { required: true, validate: validateAddress })}
                />
                {errors.walletAddress && errors.walletAddress.type === 'validate' && (
                  <div className="text-white">Please enter a valid wallet address</div>
                )}
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
                      {...register('avatar')}
                      onChange={onFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/login">
                <button className="border-2 border-gold hover:bg-blue-450 text-gold font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8 mr-4">
                  LOGIN
                </button>
              </Link>
              <button
                className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
                type="submit"
              >
                CREATE ACCOUNT
              </button>
              {/* <button onClick={() => console.log(getFieldState('username'))} className="text-white">
                get field state
              </button> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm

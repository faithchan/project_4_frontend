import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import jwtDecode from 'jwt-decode'
import { useForm } from 'react-hook-form'
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

const Edit: NextPage = () => {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>()
  const [userAddress, setUserAddress] = useState<string>()
  const [displayPicture, setDisplayPicture] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: any) => {
    data.username = data.username.toLowerCase()
    console.log('data: ', data)
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users/edit/${userProfile[0]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      console.log('response:', res)
      alert('Update success! Please click ok to be redirected to login.')
      localStorage.removeItem('token')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } catch (err) {
      console.log(err)
      alert('Error updating profile, please try again')
    }
  }

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${userAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      console.log('user data:', data)
      if (data.length === 0) {
        console.log('user does not exist')
      } else {
        setUserProfile(data)
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
      setDisplayPicture(url)
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

  useEffect(() => {
    if (userAddress) {
      fetchUserProfile()
    }
  }, [userAddress])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      setUserAddress(decodedToken.walletAddress)
    }
  }, [])

  return (
    <div className="flex justify-center items-center w-full mt-4 mb-32">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className=" px-10 pt-8 rounded-xl w-screen max-w-sm">
            <div className="space-y-6">
              <div>
                <label className="block mb-1 md:text-sm text-xs text-white font-body">
                  Username
                </label>
                <input
                  type="text"
                  className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full mt-2"
                  {...register('username')}
                  placeholder={userProfile && userProfile[0].username}
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
                  {...register('email', { validate: validateEmail })}
                  placeholder={userProfile && userProfile[0].email}
                />
                {errors.email && errors.email.type === 'validate' && (
                  <div className="text-white">Please enter a valid email address</div>
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
                  {...register('walletAddress', { validate: validateAddress })}
                  placeholder={userProfile && userProfile[0].walletAddress}
                />
                {errors.walletAddress && errors.walletAddress.type === 'validate' && (
                  <div className="text-white">Please enter a valid wallet address</div>
                )}
              </div>
              <div>
                <label className="md:text-sm text-xs text-white font-body tracking-wider">
                  Profile Picture
                </label>
                <div className="flex justify-center">
                  {displayPicture ? (
                    <img src={displayPicture} width="125px" height="125px" />
                  ) : (
                    userProfile && <img src={userProfile[0].avatar} width="250px" height="250px" />
                  )}
                </div>
                <div className="flex items-center justify-center w-full mt-2">
                  <label className="flex flex-col border-2 border-dashed w-full rounded-lg h-14 group">
                    <div className="flex flex-col items-center justify-center pt-3 cursor-pointer">
                      <p className="lowercase text-sm text-white group-hover:text-purple-600 pt-1 tracking-wider">
                        Update Display Picture
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpeg,.jpg,.png,.gif"
                      {...register('avatar')}
                      onChange={onFileUpload}
                      placeholder={userProfile ? userProfile[0].avatar : ''}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
                type="submit"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Edit

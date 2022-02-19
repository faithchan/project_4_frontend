import { useContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { create } from 'ipfs-http-client'
const url: string | any = 'https://ipfs.infura.io:5001/api/v0'
const client = create(url)

// redirect to login page if not logged in
// username, email, password, wallet address, avatar

type FormData = {
  username: string
  email: string
  password: string
  walletAddress: string
  avatar: string
}

const Edit = () => {
  const [userProfile, setUserProfile] = useState()
  const [userAddress, setUserAddress] = useState<string>()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({})

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
      console.log('decoded token: ', decodedToken)
    }
  }, [])

  return <div>edit user</div>
}

export default Edit

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import UserNFTCard from '../../components/UserNFTCard'
import globalContext from '../../context/context'
import Image from 'next/image'

const Username = () => {
  // NEED TO REFACTOR VERIFIED - Need to check if user is verified designer by jwt or global context!!

  const router = useRouter()
  const context = useContext(globalContext)
  const { id } = router.query
  const [verified, setVerified] = useState(true)
  const [artistProfile, setArtistProfile] = useState<any>()
  const [userProfile, setUserProfile] = useState<any>()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const fetchArtistProfile = async () => {
    console.log('id: ', id)
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/profile/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.length === 0) {
        console.log('artist does not exist')
      } else {
        console.log('artist profile: ', data)
        setArtistProfile(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${context.walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.length === 0) {
        console.log('user does not exist')
      } else {
        console.log('user profile: ', data)
        setUserProfile(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const checkWhitelistStatus = async () => {
    if (artistProfile) {
      const address = artistProfile[0].walletAddress
      const txn = await context.nftContract.isWhitelisted(address)
      setVerified(txn)
    }
  }

  const checkIfFollowing = async () => {
    const following = userProfile[0].following
    const artistAddress = artistProfile[0].walletAddress
    const status = following.includes(artistAddress)
    setIsFollowing(status)
    console.log('status: ', status)
  }

  const followArtist = async () => {
    const following = userProfile[0].following
    const artistAddress = artistProfile[0].walletAddress
    following.push(artistAddress)
    const object = { following: following }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${context.walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
      })
      const data = await res.json()
      // console.log('response: ', data)
    } catch (err) {
      console.log('error adding followers: ', err)
    }
  }

  const unfollowArtist = async () => {
    const following = userProfile[0].following
    const artistAddress = artistProfile[0].walletAddress
    console.log(`removing artist ${artistAddress} from ${following}`)
    const newArr = following.filter((x: any) => x !== artistAddress)
    console.log('unfollowed array: ', newArr)
    const object = { following: newArr }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${context.walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
      })
      const data = await res.json()
      console.log('response: ', data)
    } catch (err) {
      console.log('error adding followers: ', err)
    }
    checkIfFollowing()
  }

  useEffect(() => {
    if (context.nftContract) {
      checkWhitelistStatus()
    }
  }, [context.nftContract, artistProfile])

  useEffect(() => {
    if (artistProfile && userProfile) {
      checkIfFollowing()
    }
  }, [artistProfile, userProfile])

  useEffect(() => {
    fetchArtistProfile()
  }, [id, isFollowing])

  useEffect(() => {
    if (context.walletAddress) {
      fetchUserProfile()
    }
  }, [context.walletAddress, isFollowing])

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
            <div className="mt-6 w-fit mx-auto">
              <img
                className="rounded-full"
                src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe"
              ></img>
            </div>
            <p className="text-gold text-2xl font-header mt-8">
              {id}
              {verified && <Image src="/verified.svg" width={38} height={38} alt="Logo"></Image>}
            </p>
            <span className="text-sm text-gray-300 mt-2 font-body">
              New York, NY - Los Angeles, CA
            </span>
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <div className="text-center mx-4">
              <p className="text-gold text-sm font-header">102</p>
              <span className="text-gray-300 font-body ">Posts</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">102</p>
              <span className="text-gray-300 font-body">Followers</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">102</p>
              <span className="text-gray-300 font-body">Following</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 my-5">
            {isFollowing ? (
              <button
                className="bg-slate-400 text-sm font-header px-10 py-2 rounded-full text-white shadow-lg"
                onClick={unfollowArtist}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="bg-gold text-sm font-header px-10 py-2 rounded-full text-white shadow-lg"
                onClick={followArtist}
              >
                Follow
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <button className="w-full py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-10  mx-32  mb-16">
        <UserNFTCard />
        <UserNFTCard />
        <UserNFTCard />
        <UserNFTCard />
        <UserNFTCard />
        <UserNFTCard />
      </div>
    </div>
  )
}

export default Username

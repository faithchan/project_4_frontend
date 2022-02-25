import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import globalContext from '../../context/context'
import jwtDecode from 'jwt-decode'
import Image from 'next/image'
import Ellipsis from '../../components/Spinner'

const Username = () => {
  const router = useRouter()
  const { walletAddress, nftContract } = useContext(globalContext)
  const { id } = router.query
  const [verified, setVerified] = useState(true)
  const [artistProfile, setArtistProfile] = useState<any>()
  const [userProfile, setUserProfile] = useState<any>()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [tokenCount, setTokenCount] = useState()
  const [artistTokens, setArtistTokens] = useState<any>(new Set())
  const [tokenData, setTokenData] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchArtistProfile = async () => {
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
        // router.push('/404')
      } else {
        // console.log('artist profile: ', data)
        setArtistProfile(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserProfile = async () => {
    if (walletAddress) {
      try {
        const res = await fetch(`${process.env.API_ENDPOINT}/users/${walletAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (data.length === 0) {
          console.log('user does not exist')
        } else {
          // console.log('user profile: ', data)
          setUserProfile(data[0])
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('no wallet address')
    }
  }

  const checkWhitelistStatus = async () => {
    if (artistProfile) {
      const address = artistProfile[0].walletAddress
      const txn = await nftContract.isWhitelisted(address)
      setVerified(txn)
    }
  }

  const checkIfFollowing = async () => {
    const following = userProfile.following
    const artistAddress = artistProfile[0].walletAddress
    const status = following.includes(artistAddress)
    setIsFollowing(status)
  }

  const followArtist = async () => {
    const usersFollowing = userProfile.following
    const artistAddress = artistProfile[0].walletAddress
    usersFollowing.push(artistAddress)
    const userObject = { following: usersFollowing }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userObject),
      })
    } catch (err) {
      console.log('error adding followers: ', err)
    }
    const artistFollowers = artistProfile[0].followers
    artistFollowers.push(walletAddress)
    console.log('updated artist followers: ', artistFollowers)
    const artistObject = { followers: artistFollowers }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${artistAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistObject),
      })
      const data = await res.json()
      // console.log('added to artist followers: ', data)
    } catch (err) {
      console.log('error adding followers: ', err)
    }
    checkIfFollowing()
  }

  const unfollowArtist = async () => {
    const following = userProfile.following
    const artistAddress = artistProfile[0].walletAddress
    const usersFollowing = following.filter((x: any) => x !== artistAddress)
    console.log('unfollowed array: ', usersFollowing)
    const userObject = { following: usersFollowing }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userObject),
      })
      const data = await res.json()
    } catch (err) {
      console.log('error adding followers: ', err)
    }
    let artistFollowers = artistProfile[0].followers
    artistFollowers = artistFollowers.filter((x: any) => x !== walletAddress)
    console.log('updated artist followers: ', artistFollowers)
    const artistObject = { followers: artistFollowers }
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${artistAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistObject),
      })
      const data = await res.json()
      console.log('removed from artist followers: ', data)
    } catch (err) {
      console.log('error adding followers: ', err)
    }
    fetchUserProfile()
    checkIfFollowing()
  }

  const fetchTokenCount = async () => {
    const address = artistProfile[0].walletAddress
    const txn = await nftContract.balanceOf(address)
    const num = txn.toNumber()
    setTokenCount(num)
  }

  //get nfts
  const fetchNFTsOwned = async () => {
    const totalSupply = await nftContract.totalSupply()
    for (let i = 0; i < totalSupply; i++) {
      const owner = await nftContract.ownerOf(i)
      if (owner === artistProfile[0].walletAddress) {
        setArtistTokens((prev: any) => new Set(prev.add(i)))
      }
    }
  }
  //get nft data - image
  const fetchTokensMetadata = async () => {
    const unregisteredData = []
    for (let i of artistTokens) {
      const uri = await nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      unregisteredData.push(data)
      // console.log('data', data)
    }
    setTokenData(unregisteredData)
    setIsLoading(false)
  }
  useEffect(() => {
    if (nftContract && artistProfile) {
      setIsLoading(true)
      fetchNFTsOwned()
    }
  }, [nftContract, artistProfile])

  useEffect(() => {
    if (artistTokens) {
      fetchTokensMetadata()
    }
  }, [artistTokens])

  // console.log('tokenData:', tokenData)

  useEffect(() => {
    if (id) {
      let token = localStorage.getItem('token')
      let tempToken: any = token
      if (tempToken) {
        let decodedToken: any = jwtDecode(tempToken)
        console.log('decoded token: ', decodedToken)
        if (decodedToken.username === id) {
          router.push('/profile')
        }
      }
    }
  }, [id])

  useEffect(() => {
    if (artistProfile && nftContract) {
      fetchTokenCount()
    }
  }, [nftContract, artistProfile])

  useEffect(() => {
    if (nftContract) {
      checkWhitelistStatus()
    }
  }, [nftContract, artistProfile])

  useEffect(() => {
    if (artistProfile && userProfile) {
      checkIfFollowing()
    }
  }, [artistProfile, userProfile])

  useEffect(() => {
    if (id) {
      fetchArtistProfile()
    }
    fetchUserProfile()
  }, [id, isFollowing, walletAddress])

  useEffect(() => {
    if (walletAddress) {
      fetchUserProfile()
    }
  }, [walletAddress, isFollowing])

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
            <div className="mt-6 w-fit mx-auto">
              <img
                className="rounded-full w-48 h-48"
                src={artistProfile ? artistProfile[0].avatar : '-'}
                width={140}
                height={140}
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
              <p className="text-gold text-sm font-header">{tokenCount ? tokenCount : '-'}</p>
              <span className="text-gray-300 font-body ">Tokens</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">
                {artistProfile ? artistProfile[0].followers.length : '-'}
              </p>
              <span className="text-gray-300 font-body">Followers</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">
                {artistProfile ? artistProfile[0].following.length : '-'}
              </p>
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
      {isLoading && (
        <div className="flex justify-center">
          <Ellipsis />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-10  mx-32  mb-16">
        {tokenData &&
          tokenData.map((data: any) => (
            <img
              className="block bg-center  bg-cover h-48 w-48 rounded-lg cursor-pointer"
              src={data.image}
              key={data.image}
              // onClick={() => setViewNFTModal(true)}
            ></img>
          ))}
      </div>
    </div>
  )
}

export default Username

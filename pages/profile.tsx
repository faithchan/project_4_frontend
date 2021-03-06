import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState, useContext } from 'react'
import verifiedImg from '../public/verified.svg'
import ViewNFTCard from '../components/ViewNFTCard'
import globalContext from '../context/context'
import Error401 from '../components/401Section'
import Ellipsis from '../components/Spinner'

const Profile: NextPage = () => {
  const { nftContract, login, walletAddress, isWhitelisted } = useContext(globalContext)
  const [userProfile, setUserProfile] = useState<any>()
  const [tokenData, setTokenData] = useState<any>([])
  const [tokensCount, setTokensCount] = useState([])
  const [viewNFTModal, setViewNFTModal] = useState(false)
  const [username, setUsername] = useState('')
  const [following, setFollowing] = useState('')
  const [followers, setFollowers] = useState('')
  const [avatar, setAvatar] = useState('')
  const [ownerTokens, setOwnerTokens] = useState<any>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const userDataURL = `${process.env.API_ENDPOINT}/users/${walletAddress}`

  const userInfo = async () => {
    try {
      const response = await fetch(userDataURL)
      const data = await response.json()
      console.log(data)
      setUsername(data[0].username)
      setFollowing(data[0].following.length)
      setFollowers(data[0].followers.length)
      setAvatar(data[0].avatar)
    } catch (err) {
      console.log('error:', err)
    }
  }
  const fetchUserProfile = async () => {
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
        setUserProfile(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //get tokens of user
  const fetchTokenCount = async () => {
    const address = userProfile[0].walletAddress
    const txn = await nftContract.balanceOf(address)
    const num = txn.toNumber()
    console.log(num)
    setTokensCount(num)
    if (num === 0) {
      setIsLoading(false)
    }
  }
  //get nfts
  const fetchNFTsOwned = async () => {
    const totalSupply = await nftContract.totalSupply()
    for (let i = 0; i < totalSupply; i++) {
      const owner = await nftContract.ownerOf(i)
      if (owner === walletAddress) {
        setOwnerTokens((prev: any) => new Set(prev.add(i)))
      }
    }
  }
  //get nft data - image
  const fetchTokensMetadata = async () => {
    const unregisteredData = []
    for (let i of ownerTokens) {
      const uri = await nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      unregisteredData.push(data)
    }
    setTokenData(unregisteredData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUserProfile()
    userInfo()
  }, [])

  useEffect(() => {
    if (userProfile && nftContract) {
      setIsLoading(true)
      fetchNFTsOwned()
      fetchTokenCount()
    }
  }, [userProfile, nftContract])

  useEffect(() => {
    if (ownerTokens) {
      fetchTokensMetadata()
    }
  }, [ownerTokens])

  if (!login) {
    return <Error401 />
  }

  return (
    <div>
      <ViewNFTCard viewNFTModal={viewNFTModal} setViewNFTModal={setViewNFTModal} />
      <div className="max-w-2xl mx-auto mt-10">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
            <div className="mt-6 w-fit mx-auto">
              <img className="rounded-full w-48 h-48 object-cover" src={avatar}></img>
            </div>
            <p className="text-gold text-2xl font-header mt-8">
              {username}
              {isWhitelisted ? <Image src={verifiedImg} alt="Logo"></Image> : ''}
            </p>
            <span className="text-sm text-gray-300 mt-2 font-body">
              New York, NY - Los Angeles, CA
            </span>
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <div className="text-center mx-4">
              <p className="text-gold text-sm font-header">{tokensCount ? tokensCount : 0}</p>
              <span className="text-gray-300 font-body ">Tokens</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">{followers ? followers : 0}</p>
              <span className="text-gray-300 font-body">Followers</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">{following ? following : 0}</p>
              <span className="text-gray-300 font-body">Following</span>
            </div>
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
          {isLoading && (
            <div className="flex justify-center">
              <Ellipsis />
            </div>
          )}
          <div className="grid grid-cols-3 gap-6 mt-3 mb-6">
            {tokenData &&
              tokenData.map((data: any) => (
                <img
                  className="object-cover h-48 w-48 rounded-lg cursor-pointer"
                  src={data.image}
                  onClick={() => setViewNFTModal(true)}
                  key={data.image}
                ></img>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

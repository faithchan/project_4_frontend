import Image from 'next/image'
import { useEffect, useState, useContext} from 'react'
import verifiedImg from "../public/verified.svg"
import ViewNFTCard from '../components/ViewNFTCard'
import { id } from 'ethers/lib/utils'
import globalContext from '../context/context'

// fetch tokens from currently logged in and connected wallet addresses


const profile = () => {
  const context = useContext(globalContext)
  // const walletAdd= context.walletAddress
  const [userData, setUserData]= useState({})
  const [verified, setVerified]=useState(true)
  const [tokensOwned, setTokensOwned] = useState([])
  const [tokensCreated, setTokensCreated] = useState([])
  const [viewNFTModal, setViewNFTModal]=useState(false)
  const [username, setUsername]= useState("")
  const [following, setFollowing]= useState("")
  const [followers, setFollowers]= useState("")
  const [avatar, setAvatar]= useState("")
  

 //Get user details - image, followers, following, type of user, 
  const userDataURL = `${process.env.API_ENDPOINT}/users/${context.walletAddress}`

  const userInfo = async() => {
      try {
          const response = await fetch (userDataURL); 
          const data = await response.json(); 
          console.log(data)
          setUserData(data[0])
          setUsername(data[0].username)
          setFollowing(data[0].following.length)
          setFollowers(data[0].followers.length)
          setAvatar(data[0].avatar)
          
      } 
      catch (err) {
          console.log("error:", err)
      }
  }
  
  const getOwnedTokens = async () => {
  }

  useEffect(() => {
    getOwnedTokens()
    userInfo()
  }, [])
  return (
    <div>
      <ViewNFTCard viewNFTModal={viewNFTModal} setViewNFTModal={setViewNFTModal}/>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
            <div className="mt-6 w-fit mx-auto">
              <img
                className="rounded-full w-48 h-48"
                src={avatar}
              ></img>
            </div>
            <p className="text-gold text-2xl font-header mt-8">{username}{verified?<Image src={verifiedImg} alt="Logo"></Image>:""}</p>
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
              <p className="text-gold text-sm font-header">{followers}</p>
              <span className="text-gray-300 font-body">Followers</span>
            </div>
            <div className=" text-center mx-4">
              <p className="text-gold text-sm font-header">{following}</p>
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
          <div className="grid grid-cols-3 gap-6 mt-3 mb-6">
            <img
              className="block bg-center bg-no-repeat bg-cover h-50 w-full rounded-lg cursor-pointer"
              src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe" onClick={()=>setViewNFTModal(true)}
            ></img>
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default profile

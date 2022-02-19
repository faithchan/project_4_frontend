import { useState, useEffect, useContext } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

// conflate created and owned tokens
// render final list

const feed = () => {
  const context = useContext(globalContext)
  const [buyModal, setBuyModal] = useState(false)
  const [userProfile, setUserProfile] = useState()
  const [creatorsFollowed, setCreatorsFollowed] = useState<any>()
  const [ownedTokens, setOwnedTokens] = useState<any>(new Set())
  const [createdTokens, setCreatedTokens] = useState<any>(new Set())
  const [finalTokens, setFinalTokens] = useState<any>(new Set())
  const [currentItemId, setCurrentItemId] = useState<number>()
  const [currentTokenId, setCurrentTokenId] = useState<number>()
  const [currentItemOwner, setCurrentItemOwner] = useState<string>()
  const [currentPrice, setCurrentPrice] = useState<any>()

  const filterTokens = async () => {}

  const fetchCreatorCreated = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    for (let creator of creatorsFollowed) {
      for (let i = 0; i < totalSupply; i++) {
        const owner = await context.nftContract.tokenCreator(i)
        if (owner === creator) {
          setCreatedTokens((prev: any) => new Set(prev.add(i)))
        }
      }
    }
  }

  const fetchCreatorOwned = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    for (let creator of creatorsFollowed) {
      for (let i = 0; i < totalSupply; i++) {
        const owner = await context.nftContract.ownerOf(i)
        if (owner === creator) {
          setOwnedTokens((prev: any) => new Set(prev.add(i)))
        }
      }
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${context.walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setUserProfile(data)
      setCreatorsFollowed(data[0].following)
      // console.log('user profile: ', data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (creatorsFollowed && context.nftContract) {
      fetchCreatorOwned()
      fetchCreatorCreated()
    }
  }, [creatorsFollowed])

  useEffect(() => {
    fetchUserInfo()
  }, [context.walletAddress])

  //----------------Initialising Wallet----------------//

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.chainId !== '0x4') {
        console.log('switch to rinkeby network')
        changeNetwork()
      } else {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const connectedAddress = await signer.getAddress()
        context.setSigner(signer)
        context.setWalletAddress(connectedAddress)
      }
    } else {
      alert('Please install Metamask')
    }
  }

  const changeNetwork = async () => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found')
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      })
    } catch (err: any) {
      console.log('error changing network: ', err.message)
    }
  }

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
    }
  }, [])

  return (
    <div>
      {buyModal ? (
        <BuyNFTModal
          itemId={currentItemId}
          tokenId={currentTokenId}
          owner={currentItemOwner}
          price={currentPrice}
          buyModal={buyModal}
          setBuyModal={setBuyModal}
        />
      ) : (
        ''
      )}
      <button
        className="text-white mr-4"
        onClick={() => {
          console.log('owned tokens: ', ownedTokens)
        }}
      >
        ownedTokens
      </button>
      <button
        className="text-white mr-4"
        onClick={() => {
          console.log('created tokens: ', createdTokens)
        }}
      >
        createdTokens
      </button>
    </div>
  )
}

export default feed

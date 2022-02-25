import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import Ellipsis from '../components/Spinner'
import { useRouter } from 'next/router'
import MarketFeedTab from '../components/MarketFeedTab'

const Feed: NextPage = () => {
  const {
    login,
    marketplaceContract,
    nftContract,
    signer,
    walletAddress,
    setSigner,
    setWalletAddress,
  } = useContext(globalContext)
  const router = useRouter()
  const [buyModal, setBuyModal] = useState<boolean>(false)
  const [creatorsFollowed, setCreatorsFollowed] = useState<any>()
  const [ownedTokens, setOwnedTokens] = useState<any>(new Set())
  const [createdTokens, setCreatedTokens] = useState<any>(new Set())
  const [filteredTokens, setFilteredTokens] = useState<any>(new Set())
  const [tokenData, setTokenData] = useState<any>([])
  const [createdLoaded, setCreatedLoaded] = useState<boolean>(false)
  const [ownedLoaded, setOwnedLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentItemId, setCurrentItemId] = useState<number>()
  const [currentTokenId, setCurrentTokenId] = useState<number>()
  const [currentItemOwner, setCurrentItemOwner] = useState<string>()
  const [currentPrice, setCurrentPrice] = useState<any>()

  const fetchTokenData = async () => {
    const fetchedData = []
    for (let token of filteredTokens) {
      const itemId = await marketplaceContract.getItemId(token)
      if (itemId.toNumber() !== 0) {
        const item = await marketplaceContract.getItemById(itemId)
        const details = {
          isListed: item.isListed,
          owner: item.owner,
          price: ethers.utils.formatUnits(item.price.toString(), 'ether'),
          tokenId: item.tokenId.toNumber(),
          itemId: item.itemId.toNumber(),
          name: null,
          description: null,
          image: null,
          username: null,
          avatar: null,
        }
        const uri = await nftContract.tokenURI(details.tokenId)
        const response = await fetch(uri)
        const data = await response.json()
        details.name = data.name
        details.description = data.description
        details.image = data.image
        const ownerInfo = await fetchCreatorInfo(details.owner)
        console.log('owner: ', ownerInfo)
        details.username = ownerInfo[0].username
        details.avatar = ownerInfo[0].avatar
        fetchedData.push(details)
        setIsLoading(false)
      } else {
        const uri = await nftContract.tokenURI(token)
        const response = await fetch(uri)
        const data = await response.json()
        data.tokenId = token
        data.listPrice = 0
        const creator = await nftContract.tokenCreator(data.tokenId)
        const creatorInfo = await fetchCreatorInfo(creator)
        // console.log('creator info: ', creatorInfo)
        data.username = creatorInfo[0].username
        data.avatar = creatorInfo[0].avatar
        fetchedData.push(data)
      }
    }
    setTokenData(fetchedData)
  }

  const renderCards = tokenData.map((item: any) => {
    return (
      <FeedCard
        key={item.image}
        name={item.name}
        description={item.description}
        image={item.image}
        price={item.price}
        itemId={item.itemId}
        isListed={item.isListed}
        owner={item.owner}
        tokenId={item.tokenId}
        username={item.username}
        avatar={item.avatar}
        buyModal={buyModal}
        setBuyModal={setBuyModal}
        setCurrentItemId={setCurrentItemId}
        setCurrentTokenId={setCurrentTokenId}
        setCurrentItemOwner={setCurrentItemOwner}
        setCurrentPrice={setCurrentPrice}
      />
    )
  })

  const filterTokens = async () => {
    const tempSet = new Set<any>()
    for (let owned of ownedTokens) {
      for (let created of createdTokens) {
        if (owned === created) {
          tempSet.add(owned)
        }
      }
    }
    for (let owned of ownedTokens) {
      for (let token of tempSet) {
        if (owned !== token) {
          tempSet.add(owned)
        }
      }
    }
    for (let created of createdTokens) {
      for (let token of tempSet) {
        if (created !== token) {
          tempSet.add(created)
        }
      }
    }
    setFilteredTokens(tempSet)
  }

  const fetchCreatorCreated = async () => {
    const totalSupply = await nftContract.totalSupply()
    for (let creator of creatorsFollowed) {
      for (let i = 0; i < totalSupply; i++) {
        const owner = await nftContract.tokenCreator(i)
        if (owner === creator) {
          setCreatedTokens((prev: any) => new Set(prev.add(i)))
        }
      }
    }
    setCreatedLoaded(true)
  }

  const fetchCreatorOwned = async () => {
    const totalSupply = await nftContract.totalSupply()
    for (let creator of creatorsFollowed) {
      for (let i = 0; i < totalSupply; i++) {
        const owner = await nftContract.ownerOf(i)
        if (owner === creator) {
          setOwnedTokens((prev: any) => new Set(prev.add(i)))
        }
      }
    }
    setOwnedLoaded(true)
  }

  const fetchCreatorInfo = async (creator: string) => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${creator}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      return data
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      console.log('creators followed: ', data[0].following)
      setCreatorsFollowed(data[0].following)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (filteredTokens) {
      fetchTokenData()
    }
  }, [filteredTokens])

  useEffect(() => {
    if (createdLoaded && ownedLoaded) {
      filterTokens()
    }
  }, [createdLoaded && ownedLoaded])

  useEffect(() => {
    if (creatorsFollowed && nftContract) {
      fetchCreatorOwned()
      fetchCreatorCreated()
    }
  }, [creatorsFollowed])

  useEffect(() => {
    fetchUserInfo()
  }, [walletAddress])

  useEffect(() => {
    if (!login) {
      router.push('/login')
    }
  }, [])

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
        setSigner(signer)
        setWalletAddress(connectedAddress)
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
    if (signer === null) {
      connectWallet()
    }
  }, [])

  if (!login) {
    return <></>
  }

  return (
    <div className="my-20">
      <MarketFeedTab />
      {buyModal && (
        <BuyNFTModal
          itemId={currentItemId}
          tokenId={currentTokenId}
          owner={currentItemOwner}
          price={currentPrice}
          buyModal={buyModal}
          setBuyModal={setBuyModal}
        />
      )}
      {isLoading ? (
        <div className="h-screen grid content-center justify-center">
          <Ellipsis color="grey" />
        </div>
      ) : (
        renderCards
      )}
    </div>
  )
}

export default Feed

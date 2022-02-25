import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import Ellipsis from '../components/Spinner'
import MarketFeedTab from '../components/MarketFeedTab'

const Market: NextPage = () => {
  const { signer, marketplaceContract, nftContract, setSigner, setWalletAddress } =
    useContext(globalContext)
  const [buyModal, setBuyModal] = useState(false)
  const [tokenData, setTokenData] = useState<any>([])
  const [loaded, setLoaded] = useState(false)
  const [currentItemId, setCurrentItemId] = useState<number>()
  const [currentTokenId, setCurrentTokenId] = useState<number>()
  const [currentItemOwner, setCurrentItemOwner] = useState<string>()
  const [currentPrice, setCurrentPrice] = useState<any>()
  const [currentTokenName, setCurrentTokenName] = useState<any>()
  const [currentTokenImage, setCurrentTokenImage] = useState<any>()
  const [currentOwnerUsername, setCurrentOwnerUsername] = useState<any>()

  const fetchMarketItems = async () => {
    const listed = await marketplaceContract.getListedItems()
    console.log('market items: ', listed)
    const allTokens = []
    for (let item of listed) {
      const details = {
        isListed: item.isListed,
        owner: item.owner,
        price: ethers.utils.formatUnits(item.price.toString(), 'ether'),
        tokenId: item.tokenId.toNumber(),
        itemId: item.itemId.toNumber(),
        name: null,
        description: null,
        image: null,
        creator: null,
        avatar: null,
      }
      const uri = await nftContract.tokenURI(details.tokenId)
      const response = await fetch(uri)
      const data = await response.json()
      details.name = data.name
      details.description = data.description
      details.image = data.image
      const ownerInfo = await fetchProfileInfo(details.owner)
      console.log('creator info: ', ownerInfo)
      details.creator = ownerInfo[0].username
      details.avatar = ownerInfo[0].avatar
      allTokens.push(details)
      setTokenData(allTokens)
    }
    setLoaded(true)
  }

  const fetchProfileInfo = async (creator: string) => {
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

  useEffect(() => {
    if (marketplaceContract) {
      fetchMarketItems()
    }
  }, [marketplaceContract])

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
        username={item.creator}
        avatar={item.avatar}
        buyModal={buyModal}
        setBuyModal={setBuyModal}
        setCurrentItemId={setCurrentItemId}
        setCurrentTokenId={setCurrentTokenId}
        setCurrentItemOwner={setCurrentItemOwner}
        setCurrentPrice={setCurrentPrice}
        setCurrentTokenName={setCurrentTokenName}
        setCurrentTokenImage={setCurrentTokenImage}
        setCurrentOwnerUsername={setCurrentOwnerUsername}
      />
    )
  })
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
      console.log('Please install Metamask')
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

  return (
    <div className="my-20">
      <MarketFeedTab />
      {buyModal && (
        <BuyNFTModal
          name={currentTokenName}
          image={currentTokenImage}
          username={currentOwnerUsername}
          itemId={currentItemId}
          tokenId={currentTokenId}
          owner={currentItemOwner}
          price={currentPrice}
          buyModal={buyModal}
          setBuyModal={setBuyModal}
        />
      )}
      {!loaded && (
        <div className="h-screen grid content-center justify-center">
          <Ellipsis />
        </div>
      )}
      {loaded && renderCards}
    </div>
  )
}

export default Market

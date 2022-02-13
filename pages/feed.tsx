import { useState, useEffect, useContext } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers } from 'ethers'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'

// SHOULD be user's following artists tokens
// but rendering all listed items first for testing

const feed = () => {
  const context = useContext(globalContext)
  const [buyModal, setBuyModal] = useState(false)
  const [listedItems, setListedItems] = useState<any>([])
  const [tokenData, setTokenData] = useState<any>([])
  const [loaded, setLoaded] = useState(false)

  const fetchMarketItems = async () => {
    const listed = await context.marketplaceContract.getListedItems()
    console.log('market items: ', listed)
    setListedItems(listed)
  }

  const fetchAllMetadata = async () => {
    let uri
    for (let i of listedItems) {
      console.log('set id: ', i)
      uri = await context.nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      setTokenData((prev: any) => [...prev, data])
    }
    setLoaded(true)
  }

  useEffect(() => {
    if (context.marketplaceContract) {
      fetchMarketItems()
    }
  }, [context.marketplaceContract])

  const renderItems = listedItems.map((item: any) => {
    return <FeedCard buyModal={buyModal} setBuyModal={setBuyModal} />
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

  const initialiseContracts = async () => {
    if (context.signer != null) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, context.signer)
      const marketplaceContract = new ethers.Contract(
        marketplaceaddress,
        Marketplace.abi,
        context.signer
      )
      context.setNftContract(nftContract)
      context.setMarketplaceContract(marketplaceContract)
    }
  }

  useEffect(() => {
    if (context.signer !== null) {
      initialiseContracts()
    }
  }, [context.signer])

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
    }
  }, [])

  return (
    <div>
      {buyModal ? <BuyNFTModal buyModal={buyModal} setBuyModal={setBuyModal} /> : ''}
      <FeedCard buyModal={buyModal} setBuyModal={setBuyModal} />
    </div>
  )
}

export default feed

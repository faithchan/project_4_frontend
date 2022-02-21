import type { NextPage } from 'next'
import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import TradeCard from '../components/TradeCard'
import globalContext from '../context/context'
import BurnNFTModal from '../components/BurnNFTModal'
import Ellipsis from '../components/Spinner'

const Trades: NextPage = () => {
  const { nftContract, marketplaceContract, signer, walletAddress, setSigner, setWalletAddress } =
    useContext(globalContext)
  const [tokenData, setTokenData] = useState<any>([])
  const [listedItemData, setListedItemData] = useState<any>([])
  const [unlistedItemData, setUnlistedItemData] = useState<any>([])
  const [ownerTokens, setOwnerTokens] = useState<any>(new Set())
  const [burnModal, setBurnModal] = useState(false)
  const [ownedItems, setOwnedItems] = useState<any>([])
  const [listedItems, setListedItems] = useState<any>(new Set()) // itemIds
  const [notListed, setNotListed] = useState<any>(new Set()) // itemsIds
  const [unregistered, setUnregistered] = useState<any>(new Set()) // tokenIds
  const [loaded, setLoaded] = useState(false)
  const [currentTokenId, setCurrentTokenId] = useState<any>()

  const filterItems = () => {
    if (ownerTokens.length === 0) {
      console.log('no tokens in wallet')
      return
    }
    if (ownedItems.length === 0) {
      setUnregistered(ownerTokens)
      // console.log('no items owned in marketplace')
      return
    }
    setUnregistered(ownerTokens)
    for (let id of ownerTokens) {
      for (let item of ownedItems) {
        const tokenId = item.tokenId.toString()
        if (tokenId === id.toString() && item.isListed === true) {
          setListedItems((prev: any) => new Set(prev.add(item.itemId)))
          setUnregistered((prev: any) => new Set([...prev].filter((x) => x !== id)))
        } else if (tokenId === id.toString() && item.isListed === false) {
          setNotListed((prev: any) => new Set(prev.add(item.itemId)))
          setUnregistered((prev: any) => new Set([...prev].filter((x) => x !== id)))
        } else {
          // console.log(`item id ${item.itemId} and token id ${id} not handled`)
        }
      }
    }
    return
  }

  const fetchMarketItems = async () => {
    const owned = await marketplaceContract.getItemsOwned()
    setOwnedItems(owned)
  }

  const fetchNFTsOwned = async () => {
    const totalSupply = await nftContract.totalSupply()
    for (let i = 0; i < totalSupply; i++) {
      const owner = await nftContract.ownerOf(i)
      if (owner === walletAddress) {
        setOwnerTokens((prev: any) => new Set(prev.add(i)))
      }
    }
  }

  const fetchTokensMetadata = async () => {
    const unregisteredData = []
    for (let i of unregistered) {
      const uri = await nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      const creator = await nftContract.tokenCreator(data.tokenId)
      const creatorInfo = await fetchCreatorInfo(creator)
      data.creator = creatorInfo[0].username
      data.avatar = creatorInfo[0].avatar
      unregisteredData.push(data)
      setTokenData(unregisteredData)
    }
  }

  const fetchListedItemsMetadata = async () => {
    const listedData = []
    for (let i of listedItems) {
      const item = await marketplaceContract.getItemById(i)
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
      const creator = await nftContract.tokenCreator(details.tokenId)
      const creatorInfo = await fetchCreatorInfo(creator)
      details.creator = creatorInfo[0].username
      details.avatar = creatorInfo[0].avatar
      listedData.push(details)
      setListedItemData(listedData)
    }
  }

  const fetchUnlistedItemsMetadata = async () => {
    const unlistedData = []
    for (let i of notListed) {
      const item = await marketplaceContract.getItemById(i)
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
      const creator = await nftContract.tokenCreator(details.tokenId)
      const creatorInfo = await fetchCreatorInfo(creator)
      details.creator = creatorInfo[0].username
      details.avatar = creatorInfo[0].avatar
      unlistedData.push(details)
      setUnlistedItemData(unlistedData)
    }
    setLoaded(true)
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

  const renderListedItems = listedItemData.map((item: any) => {
    return (
      <TradeCard
        key={item.image}
        tokenId={item.tokenId}
        itemId={item.itemId}
        name={item.name}
        image={item.image}
        listPrice={item.price}
        isListed={item.isListed}
        creator={item.creator}
        avatar={item.avatar}
        burnModal={burnModal}
        setBurnModal={setBurnModal}
        setCurrentTokenId={setCurrentTokenId}
      />
    )
  })

  const renderUnlistedItems = unlistedItemData.map((item: any) => {
    return (
      <TradeCard
        key={item.image}
        tokenId={item.tokenId}
        itemId={item.itemId}
        name={item.name}
        image={item.image}
        listPrice={item.price}
        isListed={item.isListed}
        creator={item.creator}
        avatar={item.avatar}
        burnModal={burnModal}
        setBurnModal={setBurnModal}
        setCurrentTokenId={setCurrentTokenId}
      />
    )
  })

  const renderTokens = tokenData.map((data: any) => {
    return (
      <TradeCard
        key={data.image}
        tokenId={data.tokenId}
        itemId={null}
        name={data.name}
        image={data.image}
        listPrice={data.listPrice}
        isListed={false}
        creator={data.creator}
        avatar={data.avatar}
        burnModal={burnModal}
        setBurnModal={setBurnModal}
        setCurrentTokenId={setCurrentTokenId}
      />
    )
  })

  useEffect(() => {
    fetchTokensMetadata()
    fetchListedItemsMetadata()
    fetchUnlistedItemsMetadata()
  }, [unregistered, listedItems, notListed])

  useEffect(() => {
    if (nftContract && marketplaceContract) {
      fetchNFTsOwned()
      fetchMarketItems()
    }
  }, [nftContract, marketplaceContract])

  useEffect(() => {
    filterItems()
  }, [ownerTokens, ownedItems])

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
    if (!window.ethereum) throw new Error('No crypto wallet found')
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    })
  }

  useEffect(() => {
    if (signer === null) {
      connectWallet()
    }
  }, [])

  return (
    <div>
      {burnModal ? (
        <BurnNFTModal tokenId={currentTokenId} burnModal={burnModal} setBurnModal={setBurnModal} />
      ) : (
        ''
      )}
      <div className="flex flex-wrap gap-10 justify-center my-20 mx-32">
        <Ellipsis />
        {loaded ? renderListedItems : ''}
        {loaded ? renderUnlistedItems : ''}
        {loaded ? renderTokens : ''}
      </div>
    </div>
  )
}

export default Trades

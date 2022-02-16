import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import TradeCard from '../components/TradeCard'
import globalContext from '../context/context'
import BurnNFTModal from '../components/BurnNFTModal'
import Ellipsis from '../components/Spinner'

const Trades = () => {
  const context = useContext(globalContext)
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
    // console.log('owner tokens: ', ownerTokens)
    if (ownerTokens.length === 0) {
      console.log('no tokens in wallet')
      return
    }
    if (ownedItems.length === 0) {
      setUnregistered(ownerTokens)
      console.log('no items owned in marketplace')
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
        }
      }
    }
    return
  }

  const fetchNFTsOwned = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    for (let i = 0; i < totalSupply; i++) {
      const owner = await context.nftContract.ownerOf(i)
      if (owner === context.walletAddress) {
        setOwnerTokens((prev: any) => new Set(prev.add(i)))
      }
    }
    console.log('total supply', totalSupply)
  }

  const fetchMarketItems = async () => {
    const owned = await context.marketplaceContract.getItemsOwned()
    setOwnedItems(owned)
  }

  const fetchTokensMetadata = async () => {
    const unregisteredData = []
    for (let i of unregistered) {
      const uri = await context.nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      unregisteredData.push(data)
      setTokenData(unregisteredData)
    }
  }

  const fetchListedItemsMetadata = async () => {
    const listedData = []
    for (let i of listedItems) {
      const item = await context.marketplaceContract.getItemById(i)
      const details = {
        isListed: item.isListed,
        owner: item.owner,
        price: ethers.utils.formatUnits(item.price.toString(), 'ether'),
        tokenId: item.tokenId.toNumber(),
        itemId: item.itemId.toNumber(),
        name: null,
        description: null,
        image: null,
      }
      const uri = await context.nftContract.tokenURI(details.tokenId)
      const response = await fetch(uri)
      const data = await response.json()
      details.name = data.name
      details.description = data.description
      details.image = data.image
      listedData.push(details)
      setListedItemData(listedData)
    }
  }

  const fetchUnlistedItemsMetadata = async () => {
    const unlistedData = []
    for (let i of notListed) {
      const item = await context.marketplaceContract.getItemById(i)
      const details = {
        isListed: item.isListed,
        owner: item.owner,
        price: ethers.utils.formatUnits(item.price.toString(), 'ether'),
        tokenId: item.tokenId.toNumber(),
        itemId: item.itemId.toNumber(),
        name: null,
        description: null,
        image: null,
      }
      const uri = await context.nftContract.tokenURI(details.tokenId)
      const response = await fetch(uri)
      const data = await response.json()
      details.name = data.name
      details.description = data.description
      details.image = data.image
      unlistedData.push(details)
      setUnlistedItemData(unlistedData)
    }
    setLoaded(true)
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
        burnModal={burnModal}
        setBurnModal={setBurnModal}
        setCurrentTokenId={setCurrentTokenId}
      />
    )
  })

  const renderTokens = tokenData.map((uri: any) => {
    return (
      <TradeCard
        key={uri.image}
        tokenId={uri.tokenId}
        itemId={null}
        name={uri.name}
        image={uri.image}
        listPrice={uri.listPrice}
        isListed={false}
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
    if (context.nftContract && context.marketplaceContract) {
      fetchNFTsOwned()
      fetchMarketItems()
    }
  }, [context.nftContract, context.marketplaceContract])

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
        context.setSigner(signer)
        context.setWalletAddress(connectedAddress)
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
    if (context.signer === null) {
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
        {loaded ? renderListedItems : ''}
        {loaded ? renderUnlistedItems : ''}
        {loaded ? renderTokens : ''}
      </div>
    </div>
  )
}

export default Trades

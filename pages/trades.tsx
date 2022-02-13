import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import TradeCard from '../components/TradeCard'
import globalContext from '../context/context'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers } from 'ethers'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'
import DeleteNFTModal from '../components/DeleteNFTModal'

const Trades = () => {
  const context = useContext(globalContext)
  // const [tokenURIs, setTokenURIs] = useState<any>([])
  const [ownerTokens, setOwnerTokens] = useState<any>([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [ownedItems, setOwnedItems] = useState<any>([])
  const [listedItems, setListedItems] = useState<any>([]) // items
  const [notListed, setNotListed] = useState<any>([]) // items
  const [unregistered, setUnregistered] = useState<any>([]) // tokenIds
  const [loaded, setLoaded] = useState(false)

  const filterItems = () => {
    console.log('owner tokens: ', ownerTokens)
    if (ownerTokens.length === 0) {
      console.log('no tokens in wallet')
      setLoaded(true)
      return
    }
    if (ownedItems.length === 0) {
      setUnregistered(ownerTokens)
      console.log('no items owned in marketplace')
      setLoaded(true)
      return
    }
    for (let id in ownerTokens) {
      console.log('iterating through token: ', id)
      for (let item in ownedItems) {
        console.log('iterating through item: ', item)
        if (item.tokenId === id && item.isListed === true) {
          setListedItems([...listedItems, item])
        } else if (item.tokenId === id && item.isListed === false) {
          setNotListed([...notListed, item])
        } else if (item.tokenId !== id) {
          setUnregistered((prevArray: any) => [...prevArray, id])
        } else {
          console.log('not handled')
        }
      }
    }
    setLoaded(true)
    return
  }

  const fetchNFTsOwned = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    console.log('total supply', totalSupply)
    for (let i = 0; i < totalSupply; i++) {
      const owner = await context.nftContract.ownerOf(i)
      if (owner === context.walletAddress) {
        // ownerTokens.push(i)
        setOwnerTokens((prevArray: any) => [...prevArray, i])
      } else {
        console.log('item not owned: ', i)
      }
    }
  }

  const fetchMetadata = async (id: number) => {
    const uri = await context.nftContract.tokenURI(id)
    const response = await fetch(uri)
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    console.log('data: ', data)
    return data
  }

  const renderCards = unregistered.map(async (id: number) => {
    const data = await fetchMetadata(id)
    console.log('token data: ', data)
    return <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
  })

  const fetchMarketItems = async () => {
    const owned = await context.marketplaceContract.getItemsOwned()
    setOwnedItems(owned)
  }

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
    console.log('trades context: ', context)
  }, [context.nftContract])

  useEffect(() => {
    filterItems()
  }, [ownerTokens])

  useEffect(() => {
    if (context.nftContract) {
      fetchNFTsOwned()
    }
  }, [context.nftContract])

  useEffect(() => {
    if (context.marketplaceContract) {
      fetchMarketItems()
    }
  }, [context.marketplaceContract])

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
    <div className="">
      <button onClick={filterItems} className="text-white">
        Filter Items
      </button>
      <button onClick={fetchNFTsOwned} className="text-white">
        Fetch tokens
      </button>
      {deleteModal ? (
        <DeleteNFTModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
      ) : (
        ''
      )}
      <div className="flex flex-wrap gap-10 justify-center my-20 mx-32">
        {loaded ? renderCards : ''}
        {/* <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} /> */}
      </div>
    </div>
  )
}

export default Trades

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
  const [tokenURIs, setTokenURIs] = useState<any>([])
  const [ownerTokens, setOwnerTokens] = useState<any>([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [ownedItems, setOwnedItems] = useState<any>([])
  const [listedItems, setListedItems] = useState<any>([]) // items
  const [notListed, setNotListed] = useState<any>([]) // items
  const [notRegistered, setNotRegistered] = useState<any>([]) // tokenIds

  // console.log('trades context: ', context)

  const filterItems = () => {
    console.log('owner tokens: ', ownerTokens)
    if (ownerTokens.length === 0) {
      console.log('no tokens in wallet')
      return
    }
    if (ownedItems.length === 0) {
      setNotRegistered(ownerTokens)
      console.log('no items owned in marketplace')
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
          setNotRegistered([...notRegistered, id])
        } else {
          console.log('not handled')
        }
      }
    }
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

  const fetchNFTData = async (id: number) => {
    const uri = await context.nftContract.tokenURI(id)
    const response = await fetch(uri)
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    console.log('data: ', data)
    setTokenURIs((prevArray: any) => [...prevArray, data])
  }

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
  // console.log('total tokens: ', notRegistered)

  // useEffect(() => {
  //   filterItems()
  // }, [ownerTokens])

  // useEffect(() => {
  //   fetchNFTData()
  // }, [ownerTokens])

  useEffect(() => {
    if (context.nftContract) {
      fetchMarketItems()
    }
  }, [context.nftContract])

  useEffect(() => {
    if (context.signer !== null) {
      initialiseContracts()
    } else {
      console.log('no signer')
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
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
        <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
      </div>
    </div>
  )
}

export default Trades

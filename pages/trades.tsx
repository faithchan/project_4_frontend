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
  const [unregistered, setUnregistered] = useState<any>([]) // tokenIds
  const [loaded, setLoaded] = useState(false)

  const filterItems = () => {
    console.log('owner tokens: ', ownerTokens)
    if (ownerTokens.length === 0) {
      console.log('no tokens in wallet')
      return
    }
    if (ownedItems.length === 0) {
      setUnregistered(ownerTokens)
      console.log('no items owned in marketplace')
      return
    }
    for (let id in ownerTokens) {
      console.log('token id: ', id)
      for (let item in ownedItems) {
        console.log('current item: ', item)
        if (item.tokenId === id && item.isListed === true) {
          setListedItems((prevArray: any) => [...prevArray, item])
        } else if (item.tokenId === id && item.isListed === false) {
          setNotListed((prevArray: any) => [...prevArray, item])
        } else if (item.tokenId !== id) {
          setUnregistered((prevArray: any) => [...prevArray, id])
        } else {
          console.log('not handled')
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
        setOwnerTokens((prevArray: any) => [...prevArray, i])
      } else {
        console.log('item not owned: ', i)
      }
    }
    console.log('total supply', totalSupply)
  }

  const fetchAllMetadata = async () => {
    let uri
    for (let i in ownerTokens) {
      try {
        uri = await context.nftContract.tokenURI(i)
      } catch (err) {
        console.log(err)
      }
      const response = await fetch(uri)
      if (!response.ok) throw new Error(response.statusText)
      const data = await response.json()
      data.tokenId = i
      setTokenURIs((prevArray: any) => [...prevArray, data])
    }
    setLoaded(true)
  }

  const fetchTokenMetadata = async (id: number) => {
    const uri = await context.nftContract.tokenURI(id)
    const response = await fetch(uri)
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    return data
  }

  const renderCards = tokenURIs.map((uri: any) => {
    return (
      <TradeCard
        tokenId={uri.tokenId}
        name={uri.name}
        image={uri.image}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        key={uri.image}
      />
    )
  })

  const fetchMarketItems = async () => {
    const owned = await context.marketplaceContract.getItemsOwned()
    console.log('market items: ', owned[0])
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

  // const loadInitialData = async () => {
  //   console.log('loading initial data')
  //   await fetchNFTsOwned()
  //   await fetchMarketItems()
  //   await filterItems()
  //   await fetchAllMetadata()
  // }

  // useEffect(() => {
  //   if ((context.nftContract, context.marketplaceContract)) {
  //     loadInitialData()
  //   }
  // }, [context.nftContract, context.marketplaceContract])

  useEffect(() => {
    console.log('trades context: ', context)
  }, [context.nftContract])

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
      <button onClick={fetchNFTsOwned} className="text-white mr-4">
        Fetch tokens
      </button>
      <button onClick={fetchMarketItems} className="text-white mr-4">
        Fetch market items
      </button>
      <button onClick={filterItems} className="text-white mr-4">
        Filter Items
      </button>
      <button onClick={() => console.log(listedItems)} className="text-white mr-4">
        Print listed items
      </button>
      <button onClick={fetchAllMetadata} className="text-white mr-4">
        Fetch Metadata
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

import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import TradeCard from '../components/TradeCard'
import globalContext from '../context/context'
import DeleteNFTModal from '../components/DeleteNFTModal'

const Trades = () => {
  const context = useContext(globalContext)
  const [tokenData, setTokenData] = useState<any>([])
  const [itemData, setItemData] = useState<any>([])
  const [ownerTokens, setOwnerTokens] = useState<any>(new Set())
  const [deleteModal, setDeleteModal] = useState(false)
  const [ownedItems, setOwnedItems] = useState<any>([])
  const [listedItems, setListedItems] = useState<any>(new Set()) // itemIds
  const [notListed, setNotListed] = useState<any>(new Set()) // itemsIds
  const [unregistered, setUnregistered] = useState<any>(new Set()) // tokenIds
  const [loaded, setLoaded] = useState(false)

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
    for (let id of ownerTokens) {
      // console.log('current token id: ', id)
      for (let item of ownedItems) {
        const tokenId = item.tokenId.toString()
        // console.log('current item: ', tokenId === id.toString())
        if (tokenId === id.toString() && item.isListed === true) {
          setListedItems((prev: any) => new Set(prev.add(item.itemId)))
        } else if (tokenId === id.toString() && item.isListed === false) {
          setNotListed((prev: any) => new Set(prev.add(item.itemId)))
        }
        //  else if (tokenId !== id.toString()) {
        //   setUnregistered((prev: any) => new Set(prev.add(id)))
        // }
        else {
          // console.log('not handled')
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
      } else {
        // console.log('item not owned: ', i)
      }
    }
    console.log('total supply', totalSupply)
  }

  const fetchMarketItems = async () => {
    const owned = await context.marketplaceContract.getItemsOwned()
    // console.log('items owned: ', owned)
    setOwnedItems(owned)
  }

  const fetchTokensMetadata = async () => {
    for (let i of ownerTokens) {
      const uri = await context.nftContract.tokenURI(i)
      const response = await fetch(uri)
      const data = await response.json()
      data.tokenId = i
      data.listPrice = 0
      setTokenData((prev: any) => [...prev, data])
    }
    setLoaded(true)
  }

  const fetchItemsMetadata = async () => {
    for (let i of listedItems) {
      const item = await context.marketplaceContract.getItemById(i)
      console.log('item data: ', item)
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
      setItemData((prev: any) => [...prev, details])
    }
  }

  const renderTokens = tokenData.map((uri: any) => {
    return (
      <TradeCard
        tokenId={uri.tokenId}
        name={uri.name}
        image={uri.image}
        listPrice={uri.listPrice}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        key={uri.image}
      />
    )
  })

  const renderItems = itemData.map((item: any) => {
    // console.log('item: ', item)
    return (
      <TradeCard
        tokenId={item.tokenId}
        name={item.name}
        image={item.image}
        listPrice={item.price}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        key={item.image}
      />
    )
  })

  useEffect(() => {
    console.log('trades context: ', context)
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
      <button
        onClick={() => {
          console.log('listed items:', listedItems)
        }}
        className="text-white mr-4"
      >
        Print listed items
      </button>
      <button
        onClick={() => {
          console.log('unlisted items: ', notListed)
        }}
        className="text-white mr-4"
      >
        Print unlisted items
      </button>

      <button
        onClick={() => {
          fetchTokensMetadata()
          fetchItemsMetadata()
        }}
        className="text-white mr-4"
      >
        Fetch Metadata
      </button>
      <button
        onClick={() => {
          console.log('items data: ', itemData)
        }}
        className="text-white mr-4"
      >
        Print item data
      </button>
      {deleteModal ? (
        <DeleteNFTModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
      ) : (
        ''
      )}
      <div className="flex flex-wrap gap-10 justify-center my-20 mx-32">
        {loaded ? renderItems : ''}
      </div>
    </div>
  )
}

export default Trades

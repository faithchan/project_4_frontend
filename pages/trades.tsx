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
  const [deleteModal, setDeleteModal] = useState(false)

  console.log('trades context: ', context)

  const fetchNFTsOwned = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    const ownerTokens = []
    for (let i = 0; i < totalSupply; i++) {
      const owner = await context.nftContract.ownerOf(i)
      if (owner === context.walletAddress) {
        ownerTokens.push(i)
      }
    }
    console.log('owner tokens: ', ownerTokens)
    try {
      for (let i in ownerTokens) {
        const uri = await context.nftContract.tokenURI(i)
        const response = await fetch(uri)
        if (!response.ok) throw new Error(response.statusText)
        const data = await response.json()
        console.log('data: ', data)
        setTokenURIs([...tokenURIs, data])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const checkApproval = async () => {
    if (context.nftContract) {
      // console.log(
      //   `checking approval for marketplace ${marketplaceaddress} for user ${context.walletAddress}`
      // )
      const status = await context.nftContract.isApprovedForAll(
        context.walletAddress,
        marketplaceaddress
      )
      console.log('approval status: ', status)
    }
  }

  const setApproval = async () => {
    if (context.nftContract) {
      console.log(`setting approval for operator ${marketplaceaddress}`)
      await context.nftContract.setApprovalForAll(marketplaceaddress, true)
    }
  }

  const fetchMarketItems = async () => {
    const ownedItems = await context.marketplaceContract.getItemsOwned()
    const listedItems = await context.marketplaceContract.getListedItems()
    // console.log('owned items: ', ownedItems)
    // console.log('listed items: ', listedItems)
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
    if (context.signer !== null) {
      initialiseContracts()
    } else {
      console.log('no signer')
    }
  }, [context.signer])

  useEffect(() => {
    if (context.nftContract) {
      // fetchNFTsOwned()
      fetchMarketItems()
      checkApproval()
    }
  }, [context.nftContract])

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
    }
  }, [])

  return (
    <div className="">
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

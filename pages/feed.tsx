import { useState, useEffect, useContext } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers } from 'ethers'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'

// SHOULD be user's following artists items but rendering all listed items atm for testing

const feed = () => {
  const context = useContext(globalContext)
  const [buyModal, setBuyModal] = useState(false)
  const [whitelistedAddrs, setWhitelistedAddrs] = useState<any>([])
  const [allUsers, setAllUsers] = useState([])

  const getAllWhitelistees = async () => {
    if (allUsers && context.nftContract) {
      for (let user of allUsers) {
        const txn = await context.nftContract.isWhitelisted(user.walletAddress)
        if (txn) {
          console.log(`${user.username} is whitelisted`)
          setWhitelistedAddrs([...whitelistedAddrs, user.walletAddress])
        } else {
          console.log(`${user.username} is not whitelisted`)
        }
      }
    } else {
      console.log('no users in database')
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setAllUsers(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAllUsers()
    if (context.nftContract) {
      fetchAllUsers()
      getAllWhitelistees()
    }
  }, [context.nftContract])

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
      <button
        className="text-white mr-4"
        onClick={() => {
          console.log('users: ', allUsers)
        }}
      >
        print all users
      </button>
      <button
        className="text-white mr-4"
        onClick={() => {
          console.log('whitelist: ', whitelistedAddrs)
        }}
      >
        print whitelistees
      </button>
      {buyModal ? <BuyNFTModal buyModal={buyModal} setBuyModal={setBuyModal} /> : ''}
      <FeedCard buyModal={buyModal} setBuyModal={setBuyModal} />
    </div>
  )
}

export default feed

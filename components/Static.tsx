import Navbar from './Navbar'
import Footer from './Footer'
import 'tailwindcss/tailwind.css'
import { useEffect, useContext } from 'react'
import globalContext from '../context/context'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { nftaddress, marketplaceaddress } from '../config'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'
import { useRouter } from 'next/router'

const Layout = ({ children }: { children: any }) => {
  const { signer, setNftContract, setMarketplaceContract, setSigner, setWalletAddress } =
    useContext(globalContext)
  const router = useRouter()

  const initialiseContracts = async () => {
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketplaceContract = new ethers.Contract(marketplaceaddress, Marketplace.abi, signer)
    setNftContract(nftContract)
    setMarketplaceContract(marketplaceContract)
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
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', function (accounts: any) {
        console.log('account: ', accounts[0])
        connectWallet()
        router.reload()
      })
    } else {
      console.log('Please install Metamask')
    }
  }, [])

  useEffect(() => {
    if (signer === null) {
      connectWallet()
    }
  }, [])

  useEffect(() => {
    if (signer !== null) {
      initialiseContracts()
    }
  }, [signer])

  return (
    <div className="bg-bgimg bg-cover">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

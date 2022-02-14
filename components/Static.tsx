import Navbar from './Navbar'
import Footer from './Footer'
import 'tailwindcss/tailwind.css'
import { useEffect, useContext } from 'react'
import GlobalContext from '../context/context'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { nftaddress, marketplaceaddress } from '../config'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'

const Layout = ({ children }: { children: any }) => {
  const context = useContext(GlobalContext)

  const initialiseContracts = async () => {
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, context.signer)
    const marketplaceContract = new ethers.Contract(
      marketplaceaddress,
      Marketplace.abi,
      context.signer
    )
    context.setNftContract(nftContract)
    context.setMarketplaceContract(marketplaceContract)
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

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
      console.log('wallet connected')
    }
  }, [])

  useEffect(() => {
    if (context.signer !== null) {
      initialiseContracts()
    }
  }, [context.signer])

  return (
    <div className="bg-bgimg bg-cover">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

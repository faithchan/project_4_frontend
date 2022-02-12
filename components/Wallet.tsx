import { useEffect, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { nftaddress, marketplaceaddress } from '../config'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'
import globalContext from '../context/context'

interface WalletProps {
  setConnected: (a: boolean) => void
  isConnected: boolean
}

const Wallet = (props: WalletProps) => {
  const context = useContext(globalContext)

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
        props.setConnected(true)
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

  const disconnectWallet = async () => {
    context.setWalletAddress('')
    context.setSigner(null)
    props.setConnected(false)
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
    initialiseContracts()
  }, [context.signer])

  return (
    <>
      {props.isConnected ? (
        <>
          <button
            onClick={disconnectWallet}
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
          >
            DISCONNECT
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
        >
          CONNECT
        </button>
      )}
    </>
  )
}

export default Wallet

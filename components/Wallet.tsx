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
  const { signer, setSigner, setWalletAddress, setNftContract, setMarketplaceContract } =
    useContext(globalContext)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.chainId !== '0x4') {
        console.log('switch to rinkeby network')
        changeNetwork()
      } else {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        console.log('connection: ', connection)
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const connectedAddress = await signer.getAddress()
        setSigner(signer)
        setWalletAddress(connectedAddress)
        props.setConnected(true)
        console.log('signer ', provider)
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
    setWalletAddress('')
    setSigner(null)
    props.setConnected(false)
  }

  const initialiseContracts = async () => {
    if (signer != null) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      const marketplaceContract = new ethers.Contract(marketplaceaddress, Marketplace.abi, signer)
      setNftContract(nftContract)
      setMarketplaceContract(marketplaceContract)
    }
  }

  useEffect(() => {
    initialiseContracts()
  }, [signer])

  return (
    <>
      {props.isConnected ? (
        <>
          <button
            onClick={disconnectWallet}
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
          >
            DISCONNECT
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
        >
          CONNECT
        </button>
      )}
    </>
  )
}

export default Wallet

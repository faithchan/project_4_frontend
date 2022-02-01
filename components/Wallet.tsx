import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useEffect } from 'react'

interface WalletProps {
  setWalletAddress: (a: string) => void
  setSigner: (a: object) => void
  setConnected: (a: boolean) => void
  setChainId: (a: string) => void
  connected: boolean
  chainId: string
}

const Wallet = (props: WalletProps) => {
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
        console.log('Connected Wallet: ', connectedAddress)
        console.log('signer: ', signer)
        props.setSigner(signer)
        props.setWalletAddress(connectedAddress)
        props.setConnected(true)
      }
    } else {
      alert('Please install Metamask')
    }
  }

  const disconnectWallet = async () => {
    props.setWalletAddress('')
    props.setConnected(false)
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

  return (
    <div>
      {props.connected ? (
        <>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}

export default Wallet

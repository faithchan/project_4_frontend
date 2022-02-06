import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

interface WalletProps {
  setWalletAddress: (a: string) => void
  setSigner: (a: object) => void
  setConnected: (a: boolean) => void
  isConnected: boolean
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
        localStorage.setItem('walletAddress', connectedAddress)
        props.setSigner(signer)
        props.setWalletAddress(connectedAddress)
        props.setConnected(true)
      }
    } else {
      alert('Please install Metamask')
    }
  }

  const disconnectWallet = async () => {
    localStorage.removeItem('walletAddress')
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
    </div>
  )
}

export default Wallet

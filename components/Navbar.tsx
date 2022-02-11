import { useState, useContext } from 'react'
import globalContext from '../context/context'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/ArkivLogo.svg'
import Search from './Search'
import walletImg from '../public/wallet.svg'
import homeImg from '../public/home.svg'
import uploadImg from '../public/upload.svg'
import AccNavigation from './AccNavigation'
import TradesNavigation from './TradesNavigation'
import Wallet from './Wallet'

const Navbar = () => {
  const context = useContext(globalContext)
  const [connected, setConnected] = useState<boolean>(false)

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

  return (
    <div className="text-gold font-header text-xs">
      <nav className="flex pt-10 px-32 place-content-between">
        <span className="mt-10 w-28">
          <Link href="/">
            <a>
              <Image src={logo} alt="Logo" />
            </a>
          </Link>
        </span>
        <span>
          <ul className="flex items-right mt-6 h-full tracking-widest">
            <li className="ml-10 mr-10 mt-2 ">
              <Link href="/feed">
                <a>
                  <Image src={homeImg}></Image>
                </a>
              </Link>
            </li>
            <li className="ml-10 mr-10 mt-2 ">
              <a onClick={connectWallet}>
                <Image src={walletImg}></Image>
              </a>
            </li>
            <li className="ml-10 mr-20 mt-2 ">
              <TradesNavigation />
            </li>
            <li className="mr-10 mt-2">
              <AccNavigation />
            </li>

            <Search />
          </ul>
        </span>
      </nav>
    </div>
  )
}

export default Navbar

import { useEffect, useContext, useState } from 'react'
import globalContext from '../context/context'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/ArkivLogo.svg'
import Search from './Search'
import walletImg from '../public/wallet.svg'
import homeImg from '../public/home.svg'
import AccNavigation from './AccNavigation'
import TradesNavigation from './TradesNavigation'
import uploadImg from '../public/upload.svg'
import tradeImg from '../public/trade.svg'
import { AnyARecord } from 'node:dns'

const Navbar = () => {
  const {
    setSigner,
    setWalletAddress,
    signer,
    login,
    walletAddress,
    nftContract,
    isWhitelisted,
    setIsWhitelisted,
  } = useContext(globalContext)
  const [type, setType] = useState('user')

  const userDataURL = `${process.env.API_ENDPOINT}/users`

  const userInfo = async () => {
    try {
      const response = await fetch(userDataURL)
      const data = await response.json()
      console.log(data)
      const index = data.findIndex((wallet: any) => wallet.walletAddress === walletAddress)
      const role = data[index].type
      setType(role)
    } catch (err) {
      console.log('error:', err)
    }
  }
  console.log(type)

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

  const checkIfWhitelisted = async () => {
    if (nftContract && walletAddress) {
      const check = nftContract.isWhitelisted(walletAddress)
      if (check) {
        console.log(check)
        setIsWhitelisted(true)
      } else {
        console.log('The current wallet address is not authorised, please contact admin')
      }
    }
  }

  useEffect(() => {
    userInfo()
    if (signer === null && login === true) {
      connectWallet()
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress && login === true) {
      checkIfWhitelisted()
    }
  }, [walletAddress])

  return (
    <div className="text-gold font-header text-xs">
      <nav className="flex pt-10 px-32 place-content-between">
        <span className="mt-9 w-28">
          <Link href="/">
            <a>
              <Image src={logo} alt="Logo" />
            </a>
          </Link>
        </span>
        <span className="flex items-right  h-full tracking-widest">
          <ul className="flex items-right mt-6 h-full tracking-widest">
            <li className="ml-10 mr-10 mt-2 ">
              {login ? (
                <Link href="/feed">
                  <a>
                    <Image src={homeImg}></Image>
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a>
                    <Image src={homeImg}></Image>
                  </a>
                </Link>
              )}
            </li>
            {/* <li className="ml-10 mr-10 mt-2 ">
              <a onClick={connectWallet}>
                <Image src={walletImg}></Image>
              </a>
            </li> */}
            <li className="ml-10 mr-10 mt-2 ">
              {login && isWhitelisted ? (
                <Link href="/mint">
                  <a onClick={connectWallet}>
                    <Image src={uploadImg}></Image>
                  </a>
                </Link>
              ) : (
                <Link href="/verify">
                  <a>
                    <Image src={uploadImg}></Image>
                  </a>
                </Link>
              )}
            </li>
            <li className="ml-10 mr-20 mt-2 ">
              {login ? (
                <Link href="/trades">
                  <a onClick={connectWallet}>
                    <Image src={tradeImg}></Image>
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a>
                    <Image src={tradeImg}></Image>
                  </a>
                </Link>
              )}
            </li>
            <li className="mr-10 mt-2">
              <AccNavigation connectWallet={connectWallet} type={type} />
            </li>
          </ul>
          <span className="ml-5"></span>
          <Search />
        </span>
      </nav>
    </div>
  )
}

export default Navbar

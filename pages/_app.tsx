import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Web3Modal from 'web3modal'
import Static from '../components/Static'
import Head from 'next/head'
import jwtDecode from 'jwt-decode'
import userContext from '../context/context'
import { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { nftaddress, marketplaceaddress } from '../config'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'

function MyApp({ Component, pageProps }: AppProps) {
  const context = useContext(userContext)
  const [isDesigner, setDesigner] = useState(false)
  const [walletAddress, setWalletAddress] = useState('0x')
  const [signer, setSigner] = useState(null)
  const [nftContract, setNftContract] = useState()
  const [marketplaceContract, setMarketplaceContract] = useState()

  // console.log('app context: ', context)

  const userLoginData = {
    designerState: isDesigner,
    walletAddress: walletAddress,
    signer: signer,
    nftContract: nftContract,
    marketplaceContract: marketplaceContract,
    setSigner: (signer: any) => setSigner(signer),
    setNftContract: (nftContract: any) => setNftContract(nftContract),
    setMarketplaceContract: (marketplaceContract: any) =>
      setMarketplaceContract(marketplaceContract),
    setWalletAddress: (address: string) => setWalletAddress(address),
  }

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

  // useEffect(() => {
  //   if (context.signer === null) {
  //     console.log('connecting wallet')
  //     connectWallet()
  //   } else {
  //     console.log('nil')
  //   }
  // }, [])

  // useEffect(() => {
  //   if (context.signer !== null) {
  //     console.log('initialising contracts')
  //     initialiseContracts()
  //   } else {
  //     console.log('app.tsx: no signer')
  //   }
  // }, [context])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
    }
  }, [])

  return (
    <div>
      <userContext.Provider value={userLoginData}>
        <Head>
          <title>ARKIV</title>
        </Head>
        <Static>
          <Component {...pageProps} />
        </Static>
        {}
      </userContext.Provider>
    </div>
  )
}

export default MyApp

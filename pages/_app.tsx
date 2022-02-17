import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Web3Modal from 'web3modal'
import Static from '../components/Static'
import Head from 'next/head'
import jwtDecode from 'jwt-decode'
import GlobalContext from '../context/context'
import { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { nftaddress, marketplaceaddress } from '../config'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'

function MyApp({ Component, pageProps }: AppProps) {
  const context = useContext(GlobalContext)
  const [login, setLogin]=useState(false)
  const [isDesigner, setDesigner] = useState(false)
  const [walletAddress, setWalletAddress] = useState('0x')
  const [signer, setSigner] = useState(null)
  const [nftContract, setNftContract] = useState()
  const [marketplaceContract, setMarketplaceContract] = useState()
  const [checkToken, setCheckToken]=useState("")

  // console.log('app context: ', context)

  const userLoginData = {
    login:login,
    designerState: isDesigner,
    walletAddress: walletAddress,
    signer: signer,
    nftContract: nftContract,
    marketplaceContract: marketplaceContract,
    setLogin: (login: boolean) => setLogin(login),
    setSigner: (signer: any) => setSigner(signer),
    setNftContract: (nftContract: any) => setNftContract(nftContract),
    setMarketplaceContract: (marketplaceContract: any) =>
      setMarketplaceContract(marketplaceContract),
    setWalletAddress: (address: string) => setWalletAddress(address),
  }

  useEffect(() => {
    //localStorage.setItem('userID', "61d8fb4d770c3094270135f7")
    if (!login) {
      const loggedInUser = localStorage.getItem("token");
      console.log(loggedInUser)
      if (loggedInUser) {
        console.log("found local storage setlogin to true");
        setCheckToken(loggedInUser)
        setLogin(true)
      }
      else {
        console.log("no local storage found for userID")
      }
      if(checkToken) {
        console.log("token exists")
      }
    }
    
  }, [checkToken]);

  return (
    <div>
      <GlobalContext.Provider value={userLoginData}>
        <Head>
          <title>ARKIV</title>
        </Head>
        <Static>
          <Component {...pageProps} />
        </Static>
      </GlobalContext.Provider>
    </div>
  )
}

export default MyApp

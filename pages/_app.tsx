import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
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

  // const initialiseContracts = async () => {
  //   if (context.signer != null) {
  //     const nftContract = new ethers.Contract(nftaddress, NFT.abi, context.signer)
  //     const marketplaceContract = new ethers.Contract(
  //       marketplaceaddress,
  //       Marketplace.abi,
  //       context.signer
  //     )
  //     context.setNftContract(nftContract)
  //     context.setMarketplaceContract(marketplaceContract)
  //   }
  // }

  // useEffect(() => {
  //   initialiseContracts()
  // }, [context.signer])

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

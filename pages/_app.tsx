import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'
import Head from 'next/head'
import GlobalContext from '../context/context'
import { useState, useContext } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const context = useContext(GlobalContext)
  const [isDesigner, setDesigner] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
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

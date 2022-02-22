import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'
import Head from 'next/head'
import GlobalContext from '../context/context'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [login, setLogin] = useState(false)
  const [isDesigner, setDesigner] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [signer, setSigner] = useState(null)
  const [nftContract, setNftContract] = useState()
  const [marketplaceContract, setMarketplaceContract] = useState()
  const [checkToken, setCheckToken] = useState('')
  const [isWhitelisted, setIsWhitelisted] = useState(false)

  const userLoginData = {
    login: login,
    designerState: isDesigner,
    walletAddress: walletAddress,
    signer: signer,
    nftContract: nftContract,
    marketplaceContract: marketplaceContract,
    isWhitelisted: isWhitelisted,
    setIsWhitelisted: (isWhitelisted: boolean) => setIsWhitelisted(isWhitelisted),
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
      const loggedInUser = localStorage.getItem('token')
      // console.log('user jwt: ', loggedInUser)
      if (loggedInUser) {
        // console.log('found local storage setlogin to true')
        setCheckToken(loggedInUser)
        setLogin(true)
      } else {
        // console.log('no local storage found for userID')
      }
      if (checkToken) {
        console.log('token exists')
      }
    }
  }, [checkToken])

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

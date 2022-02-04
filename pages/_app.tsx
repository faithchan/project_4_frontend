import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'
import Head from 'next/head'
import userContext from "../context/context"
import {useState, useEffect} from 'react'



function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setLogin] = useState(false)
  const [isDesigner, setDesigner] = useState(false)
  const [wallet, setWalletID] =useState("123d")

  const userLoginData={
    login: isLoggedIn,
    designerState: isDesigner,
    walletID:wallet,
  }

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
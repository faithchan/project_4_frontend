import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'
import Head from 'next/head'
import userContext from "../context/context"
import {useState} from 'react'



function MyApp({ Component, pageProps }: AppProps) {
  const [login, setLogin] = useState(true)
  const [designerState, setDesignerState] = useState(false)
  const [walletID, setWalletID] =useState("123d")
  const userLoginData={
    login: login,
    designerState: designerState,
    walletID:walletID
  }
  console.log(userLoginData)
  
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
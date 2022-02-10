import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'
import Head from 'next/head'
import jwtDecode from 'jwt-decode'
import userContext from '../context/context'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setLoginState] = useState(false)
  const [isDesigner, setDesigner] = useState(false)
  const [walletAddress, setWalletAddress] = useState('123d')

  const userLoginData = {
    login: isLoggedIn,
    designerState: isDesigner,
    walletID: walletAddress,
    setLoginState: (state: boolean) => setLoginState(state),
  }

  useEffect(() => {
    const address = localStorage.getItem('walletAddress')
    if (address) {
      setWalletAddress(address)
    }
  })

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      setLoginState(true)
      // if (decodedToken.role === 'admin') {
      //   console.log('decoded token: ', decodedToken)
      //   setDesigner(true)
      // } else {
      //   setDesigner(false)
      // }
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

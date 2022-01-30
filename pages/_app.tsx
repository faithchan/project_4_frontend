import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Static from '../components/Static'

import Head from 'next/head'


function MyApp({ Component, pageProps }: AppProps) {

  return (

    <div>
        <Head>
          <title>ARKIV</title>
        </Head>
        <Static>
          <Component {...pageProps} />
          </Static>
       
    </div>
  )
}

export default MyApp
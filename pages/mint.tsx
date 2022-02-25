import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import MintNFTForm from '../components/MintNFTForm'
import globalContext from '../context/context'
import { useRouter } from 'next/router'
import Error401 from '../components/401Section'

const MintNFT: NextPage = () => {
  const { login } = useContext(globalContext)
  const router = useRouter()

  if (!login) {
    return <Error401 />
  }

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">Mint NFT</h1>
      <MintNFTForm />
    </div>
  )
}

export default MintNFT

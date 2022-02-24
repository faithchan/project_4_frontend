import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import MintNFTForm from '../components/MintNFTForm'
import globalContext from '../context/context'
import { useRouter } from 'next/router'

const MintNFT: NextPage = () => {
  const { login } = useContext(globalContext)
  const router = useRouter()

  useEffect(() => {
    if (!login) {
      router.push('/login')
    }
  }, [])

  if (!login) {
    return <></>
  }

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">Mint NFT</h1>
      <MintNFTForm />
    </div>
  )
}

export default MintNFT

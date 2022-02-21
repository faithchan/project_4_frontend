import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import MintNFTForm from '../components/MintNFTForm'
import globalContext from '../context/context'

const MintNFT: NextPage = () => {
  const context = useContext(globalContext)
  const [ListModal, setListModal] = useState<boolean>(false)

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">Mint NFT</h1>
      <MintNFTForm />
    </div>
  )
}

export default MintNFT

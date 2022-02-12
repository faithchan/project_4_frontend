import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import MintNFTForm from '../components/MintNFTForm'
import globalContext from '../context/context'

const uploadnft = () => {
  const context = useContext(globalContext)
  const router = useRouter()
  const [ListModal, setListModal] = useState<boolean>(false)
  console.log('upload nft context: ', context)

  // useEffect(() => {
  //   if (context.signer === null) {
  //     router.push('/wallet')
  //   }
  // }, [])

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">
        UPLOAD NFT
      </h1>
      <MintNFTForm />
    </div>
  )
}

export default uploadnft

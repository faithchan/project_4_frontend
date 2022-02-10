import React, { useState } from 'react'
import UploadNFTForm from '../components/UploadNFTForm'

const uploadnft = () => {
  const [ListModal, setListModal] = useState<boolean>(false)

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">
        UPLOAD NFT
      </h1>
      <UploadNFTForm />
    </div>
  )
}

export default uploadnft

import React, { useState } from 'react'
import UploadNFTForm from '../components/UploadNFTForm'
import ListNFTToken from '../components/ListNFTToken'

const uploadnft = () => {
  const [ListModal, setListModal] = useState<boolean>(false)

  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">
        UPLOAD NFT
      </h1>
      <UploadNFTForm ListModal={ListModal} setListModal={setListModal} />
      {/* <ListNFTToken /> */}
    </div>
  )
}

export default uploadnft

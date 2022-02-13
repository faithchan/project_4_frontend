import { useState } from 'react'
import FeedCard from '../components/FeedCard'
import BuyNFTModal from '../components/BuyNFTModal'

const feed = () => {
  const [buyModal, setBuyModal] = useState(false)
  return (
    <div>
      {buyModal ? <BuyNFTModal buyModal={buyModal} setBuyModal={setBuyModal} /> : ''}
      <FeedCard buyModal={buyModal} setBuyModal={setBuyModal} />
    </div>
  )
}

export default feed

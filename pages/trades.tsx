import React from 'react'
import TradeCard from '../components/TradeCard'
import DeleteNFTModal from '../components/DeleteNFTModal'

const trades = () => {
    return (
        <div className="">
            <DeleteNFTModal/>
            <div className="flex flex-wrap gap-10 justify-center my-20 mx-32">
            <TradeCard />
            <TradeCard />
            <TradeCard />
            <TradeCard />
            </div>
        </div>
    )
}

export default trades

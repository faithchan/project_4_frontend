import React from 'react'
import TradeCard from '../components/TradeCard'

const trades = () => {
    return (
        <div className="my-20 mx-32">
            <div className="flex flex-wrap gap-10 justify-center">
            <TradeCard />
            <TradeCard />
            <TradeCard />
            <TradeCard />
            </div>
        </div>
    )
}

export default trades

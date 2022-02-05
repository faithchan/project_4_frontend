import React from 'react'
import TradeCard from '../components/TradeCard'

const trades = () => {
    return (
        <div className="my-20">
            <div className="flex flex-wrap space-x-10 justify-center">
            <TradeCard />
            <TradeCard />
            </div>
        </div>
    )
}

export default trades

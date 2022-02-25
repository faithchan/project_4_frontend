import React from 'react'
import { useRouter } from 'next/router'

const MarketFeedTab = () => {
  const router = useRouter()
  return (
    <div>
      <ul className="flex cursor-pointer justify-center font-header">
        <li
          className="py-2 px-6 mx-5 bg-white rounded-full text-gray-500 hover:bg-gray-200"
          onClick={() => router.push('/market')}
        >
          Marketplace
        </li>
        <li
          className="py-2 px-6 mx-5 bg-white rounded-full text-gray-500 hover:bg-gray-200"
          onClick={() => router.push('/feed')}
        >
          Following feed
        </li>
      </ul>
    </div>
  )
}

export default MarketFeedTab

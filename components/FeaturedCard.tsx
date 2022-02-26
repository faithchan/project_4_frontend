import React from 'react'
import { HeartIcon } from '@heroicons/react/solid'

interface detailProps {
  image: string
  title: string
  price: string
  artist: string
}
const FeaturedCard = (props: detailProps) => {
  return (
    <div className="w-72 p-8 bg-purple opacity-80 rounded-3xl mt-14">
      <img className="w-56 h-56 object-cover rounded-3xl" src={props.image} alt="" />
      <div className="mt-4">
        <h1 className="text-lg font-bold text-gold font-header tracking-widest">{props.title}</h1>

        <div className="flex justify-between ">
          <span>
            <p className="text-xs mt-2 font-header text-gray-300 tracking-widest">
              BY {props.artist}
            </p>
            <button className="block text-sm font-body font-semibold text-gray-300 cursor-auto mt-2">
              {props.price} Eth
            </button>
          </span>

          <span>
            <HeartIcon className="w-8 text-gray-300 cursor-pointer" />
            <p className="font-body text-xs text-gray-300 text-center mt-1">122</p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCard

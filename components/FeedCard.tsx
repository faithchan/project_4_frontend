import React from 'react'
interface buyProps{
  buyModal:boolean,
  setBuyModal:(a:boolean)=>void
}

const FeedCard = (props:buyProps) => {
  return (
    <div className="flex justify-center mt-20 mb-10">
      <div className=" px-8 pt-6 pb-6 bg-purple opacity-80 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500">
        <div className="">
          <span className="flex space-x-4 mr-6">
            <img
              className="w-10 h-10 object-cover rounded-full mr-2  mb-4"
              src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe"
              alt=""
            />
            <span className="mt-3">
              <p className="text-center text-gold font-header text-xs tracking-widest">FAKURIAN</p>
            </span>
          </span>

          <span className="font-MT font-semibold text-left leading-loose">
            <img
              className="w-96 h-96 object-cover rounded-3xl"
              src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80"
              alt=""
            />
            <p className="text-gold mt-4 text-md font-header tracking-widest">Title of NFT</p>
            <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">
                Description of the NFT
              </p>
            <span className="flex justify-between">
              <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">
                List Price: 1 Eth || Else Blank
              </p>
              <button className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg" onClick={()=>props.setBuyModal(true)}>Buy</button>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default FeedCard

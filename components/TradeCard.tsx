import React, { useState } from 'react'
import deleteImg from '../public/delete.svg'
import Image from 'next/image'
import ListNFTToken from './ListNFTToken'


interface deleteProps{
  deleteModal:boolean,
  setDeleteModal:(a:boolean)=>void
}
const TradeCard = (props:deleteProps) => {
  const [ListNFTModal, setListNFTModal] = useState(false)
  return (
    <div>
      {ListNFTModal ? (
        <ListNFTToken ListNFTModal={ListNFTModal} setListNFTModal={setListNFTModal} />
      ) : (
        ''
      )}
      <div className="w-full px-8 pt-8 pb-6 bg-purple opacity-80 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500 ">
        <div className="flex justify-between space-x-14">
          <span className="font-MT font-semibold text-left leading-loose">
            <img
              className="w-44 h-44 object-cover rounded-3xl"
              src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80"
              alt=""
            />
            <p className="text-gold mt-4 text-md font-header tracking-widest">Title of NFT</p>
            <p className="text-gray-300 font-body text-xs mt-1 tracking-widest">
              List Price: 1 eth
            </p>
            <p
              className="text-gray-300 font-body text-xs mt-1 tracking-widest underline cursor-pointer"
              onClick={() => setListNFTModal(true)}
            >
              List this NFT
            </p>
          </span>
              <span > 
                <p className="text-gold text-sm font-header tracking-widest">Designed by</p>
                  <span className="flex space-x-4 mr-6">
                    <img className="w-16 h-16 object-cover rounded-full mr-4 mt-6 mb-4" src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe" alt="" />
                        <span className="my-auto">
                        <p className="text-center text-gold font-header text-xs   tracking-widest">FAKURIAN</p>
                        <hr className="border-gold border my-2"></hr>
                        <p className="text-center text-white font-body text-xs  tracking-widest">View Profile</p>
                        </span> 
                    </span>

                    <p className="text-gold text-sm font-header tracking-widest mt-2">Owned by</p>
                    <p className="text-gold text-xs font-header tracking-widest mt-2">RACHEL LEE</p>
                    <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">Bought on 12 Feb 2021</p>
                    <span className="flex justify-between">
                    <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">Price:0.01 Eth</p>
                    <span className="pt-2 cursor-pointer" onClick={()=>props.setDeleteModal(true)}>
                    <Image className="mt-4" src={deleteImg} alt="Logo" />
                    </span>
                    </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default TradeCard

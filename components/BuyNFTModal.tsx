import React from 'react'

const BuyNFTModal = () => {
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white">
        <form className="">
          <div className="text-center p-5 flex-auto justify-center">
            <p className="text-2xl text-gold font-header px-8">Purchase NFT</p>
          </div>
          <div className="px-20">
            <p>you are making purchase of this NFT by xx for 1 Eth</p>
          </div>
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100">
              Cancel
            </button>
            <button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg ">
              hi
            </button>

            <button
              className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg "
              type="submit"
            >
              Continue to List
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BuyNFTModal

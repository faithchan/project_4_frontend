import React from 'react'
interface uploadProps {
  ListModal: boolean
  setListModal: (a: boolean) => void
}

const ListNFTToken = (props: uploadProps) => {
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white">
        <div className="">
          <div className="text-center p-5 flex-auto justify-center">
            <p className="text-2xl text-gold font-header px-8">Enter List Price</p>
          </div>

          <div className="grid grid-cols-1 mx-7">
            <input
              className="bg-gray-100 text-gray-800 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
              type="text"
              placeholder="0.01 Eth"
            />
            <p className="text-xs text-gray-400 font-body mt-4">Enable Royalty</p>
            <div className="relative inline-block mt-2 w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              <input
                className="bg-gray-100 text-gray-800 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
                type="number"
                min="0.01"
                placeholder="0.01 Eth"
              />
            </div>
          </div>

          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                props.setListModal(false)
              }}
            >
              List Later
            </button>
            <button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg ">
              Approve and List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListNFTToken

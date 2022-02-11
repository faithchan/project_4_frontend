import React from 'react'

const UserProfileCard = () => {
    return (
        <div>
            <div className="w-72 p-8 bg-purple opacity-80 rounded-3xl mt-14">
      <img
        className="w-56 h-56 object-cover rounded-3xl"
        src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80"
        alt=""
      />
      <div className="mt-4">
        <h1 className="text-lg font-bold text-gold font-header tracking-widest">
          SILO
        </h1>
        <p className="text-xs mt-2 font-header text-gray-300 tracking-widest">
          BY FAKURIAN
        </p>

        <div className="flex justify-between ">
          <button className="block text-sm font-body font-semibold text-gray-300 cursor-auto">
            0.01 Eth
          </button>
          <button className="text-lg block font-semibold p-6 text-gray-300 hover:text-white bg-white rounded-full shadow hover:shadow-md transition duration-300"></button>
        </div>
      </div>
    </div>
        </div>
    )
}

export default UserProfileCard

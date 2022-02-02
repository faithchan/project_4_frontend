import React from 'react'

const SignUpForm = () => {
    return (
        <div className="flex justify-center items-center w-full  mt-4 mb-32">
        <form>
          <div className=" px-10 pt-8 rounded-xl w-screen shadow-md max-w-sm">
            <div className="space-y-6">
              <div>
                <label className="block mb-1 text-gray-300 font-semibold">Name</label>
                <input type="text" className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full" />
              </div>
              <div>
                <label className="block mb-1 text-gray-300 font-semibold">Email</label>
                <input type="text" className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full" />
              </div>
              <div>
                <label className="block mb-1 text-gray-300 font-semibold">Password</label>
                <input type="password" className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full" />
              </div>
              <div>
                <label className="block mb-1 text-gray-300 font-semibold">Meta Wallet</label>
                <input type="text" className="bg-gray-800 px-4 py-2 border text-white border-gray-400 outline-none rounded-md w-full" />
              </div>
            </div>
            <div className="flex justify-center">
              <button className=" border-2 border-gold hover:bg-blue-450 text-gold font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8 mr-4"  >LOGIN</button>
              <button className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"  >CREATE ACCOUNT</button>
            </div>
          </div>
        </form>
    </div>
    )
}

export default SignUpForm

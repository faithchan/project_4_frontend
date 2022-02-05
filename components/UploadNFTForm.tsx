import React from 'react'

const UploadNFTForm = () => {
    return (
        <div className="mb-20">
            <div className="w-full max-w-lg p-5   mx-auto my-auto rounded-xl shadow-lg ">
                <form className="m-4 font-MT" >

                    <span className="flex mt-4 justify-between">   
                        <span className="">
                        <label className="block mb-1 text-gray-300 font-body">Title</label>
                        </span>
                        <span>
                        <input type="text" className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full" />
                        </span>   
                    </span>

                    <span className="flex mt-4 justify-between">   
                        <span className="">
                        <label className="block mb-1 text-gray-300 font-body">Description</label>
                        </span>
                        <span className="">
                        <textarea className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full" />
                        </span>   
                    </span>

                    <span className="flex mt-4 justify-between">   
                        <span className="">
                        <label className="block mb-1 text-gray-300 font-body">Pricing</label>
                        </span>
                        <span>
                        <input type="text" className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full" />
                        </span>   
                    </span>

                    <span className="flex mt-4 justify-between">   
                        <span className="">
                        <label className="block mb-1 text-gray-300 font-body">Upload Nft (jpg/png/gif)</label>
                        </span>
                        <span>
                        <input type="text" className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full" />
                        </span>   
                    </span>

                    <div className="flex justify-between">
                        <button className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">Mint Token</button>
                        <button className="bg-gold  text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">Upload NFT</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default UploadNFTForm

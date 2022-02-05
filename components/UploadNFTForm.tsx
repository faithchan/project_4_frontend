import React from 'react'

const UploadNFTForm = () => {
    return (
        <div className="flex items-center justify-center mt-10 mb-20">
                <form className="grid w-6/12 md:w-5/12 lg:w-4/12">
                    <div className="grid grid-cols-1  mx-7">
                    <label className="md:text-sm text-xs text-white font-body tracking-wider">Title</label>
                    <input className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2" type="text" placeholder="Silo" />
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="md:text-sm text-xs text-white font-body tracking-wider">Pricing</label>
                    <input className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2" type="text" placeholder="0.01 Eth" />
                    </div>
                    <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="md:text-sm text-xs text-white font-body tracking-wider">Description</label>
                    <textarea className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2" placeholder="Brief write up about NFT" />
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="md:text-sm text-xs text-white font-body tracking-wider">Upload Photo</label>
                        <div className='flex items-center justify-center w-full mt-2'>
                            <label className='flex flex-col border-2 border-dashed w-full rounded-lg h-32 group'>
                                <div className='flex flex-col items-center justify-center pt-7'>
                                <svg className="w-10 h-10 text-purple-400 group-hover:text-purple-600" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                 <p className='lowercase text-sm text-white group-hover:text-purple-600 pt-1 tracking-wider'>Select a photo</p>
                                 <input type='file' className="hidden" accept=".jpeg,.jpg,.png,.gif"/>
                                </div>
                            </label>
                            
                        </div>
                    </div>

                    <div className='flex items-center justify-center pt-5 pb-5'>
                    <button className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">MINT TOKEN</button>
                    </div>

                </form>
            </div>
         
    )
}

export default UploadNFTForm

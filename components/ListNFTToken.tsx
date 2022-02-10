import React, { useState } from 'react'
interface uploadProps{
    ListNFTModal:boolean,
    setListNFTModal:(a:boolean)=>void
}

const ListNFTToken = (props:uploadProps) => {
    const [showRoyalty, setShowRoyalty] = useState(true)
    const [showList, setShowList] = useState(false)
    const [showContBtn, setShowContBtn] = useState(false)
    const [showRoyaltyBtn, setShowRoyaltyBtn] = useState(true)

    const royaltyHandler =(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setShowRoyalty(false);
        setShowList(true);
    }
    const listTokenHandler =(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setShowList(false)
        props.setListNFTModal(false)
    }
    
    return (
    <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
    <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white">

            {showRoyalty?<form className="" onSubmit={royaltyHandler}>
                <div className="text-center p-5 flex-auto justify-center">
                    <p className="text-2xl text-gold font-header px-8">Set Royalty</p>    
                </div>

                <div className="px-20">
                <label className="block mb-1 md:text-sm text-xs text-gray-400 font-body">*In Percent (%)</label>
                <input
                    type="number"
                    className="bg-gray-100 px-4 py-2 border text-gray-600 border-gray-400 outline-none rounded-md w-full mt-2" placeholder="2%" min="1" max="99"
                    required
                />
                </div>

                <div className="p-3 mt-2 text-center space-x-4 md:block">
                    <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100" onClick={()=>props.setListNFTModal(false)}>
                        Cancel
                    </button>

                    {showRoyaltyBtn?<button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg " onClick={()=>{setShowContBtn(true); setShowRoyaltyBtn(false)}}>Set Royalty</button>:""}
                    
                    {showContBtn?<button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg " type="submit">Continue to List</button>:""}
                </div>

                {/* <div className="p-3 mt-2 text-center space-x-4 md:block">
                    <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100">
                        List Later
                    </button>
                    <button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg ">Approve and List</button>
                </div> */}
                </form>:""}
                {/* Next Form */}
                {showList?<form className="" onSubmit={listTokenHandler}>
                <div className="text-center p-5 flex-auto justify-center">
                    <p className="text-2xl text-gold font-header px-8">Enter Price</p>    
                </div>

                <div className="px-20">
                <label className="block mb-1 md:text-sm text-xs text-gray-400 font-body">*In Eth</label>
                <input
                    type="number"
                    className="bg-gray-100 px-4 py-2 border text-gray-600 border-gray-400 outline-none rounded-md w-full mt-2" placeholder="1 Eth" min="1" 
                    required
                />
                </div>

                <div className="p-3 mt-2 text-center space-x-4 md:block">
                    <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100" onClick={()=>props.setListNFTModal(false)}>
                        Cancel
                    </button>
                    <button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg" type="submit">List Token</button>
                </div>

                {/* <div className="p-3 mt-2 text-center space-x-4 md:block">
                    <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100">
                        List Later
                    </button>
                    <button className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg ">Approve and List</button>
                </div> */}
                </form>:""

                }
            </div>
        </div>
    )
}


export default ListNFTToken

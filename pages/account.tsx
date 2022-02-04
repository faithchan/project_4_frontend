import React from 'react'
import Image from 'next/image'

const account = () => {

    return (
        <div>
         <div className="max-w-2xl mx-auto mt-10">

<div className="px-3 py-2">
  
    <div className="flex flex-col gap-1 text-center">
    <div className="mt-6 w-fit mx-auto">
   <img className="rounded-full" src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe"></img>
          
        </div>
        <p className="text-gold text-2xl font-header mt-10">Marina Davinchi</p>
        <span className="text-sm text-gray-300 mt-2 font-body">New York, NY - Los Angeles, CA</span>
    </div>



    <div className="flex justify-center items-center gap-2 my-4">
        <div className="text-center mx-4">
            <p className="text-gold text-sm font-header">102</p>
            <span className="text-gray-300 font-body ">Posts</span>
        </div>
        <div className=" text-center mx-4">
            <p className="text-gold text-sm font-header">102</p>
            <span className="text-gray-300 font-body">Followers</span>
        </div>
        <div className=" text-center mx-4">
            <p className="text-gold text-sm font-header">102</p>
            <span className="text-gray-300 font-body">Folowing</span>
        </div>
    </div>
  

    <div className="flex justify-center gap-2 my-5">
        <button className="bg-gold text-sm font-header px-10 py-2 rounded-full text-white shadow-lg">Follow</button>
    </div>
    
    
    <div className="flex justify-between items-center">
        <button className="w-full py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
        </button>
    </div>


       <div className="grid grid-cols-3 gap-2 my-3">
            <a className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg" href="" ></a>
       </div>

</div>
</div>
        </div>
    )
}

export default account

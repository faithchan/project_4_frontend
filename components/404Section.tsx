import React from 'react'
import errorImg from "../public/404.svg"
import Image from 'next/image'
import { useRouter } from 'next/router'


const Error = () => {
    const router= useRouter()
    return (
<div className="h-screen w-screen flex items-center justify-center">
	<div className="container flex flex-col md:flex-row items-center justify-center px-2 text-gray-700">
    <div className="max-w-lg mr-24">
      <Image width={300} height={180} src={errorImg}></Image>
    </div>
           <div className="max-w-md">
            <p
              className="text-2xl md:text-3xl font-body leading-normal text-gold"
            >Sorry we couldn't find this page. </p>
          <p className="my-4 font-body text-gray-300 text-sm">Contact our admin for more details.</p>
          
          <button
            className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-4 rounded-full text-xs mx-auto "
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
    </div>
      
    
  </div>
</div>
   
    )
}

export default Error

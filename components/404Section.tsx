import React from 'react'
import errorImg from "../public/404.svg"
import Image from 'next/image'
import { useRouter } from 'next/router'


const Error = () => {
    const router= useRouter()
    return (
        <div className="h-screen w-screen mt-40">
               <div className="flex justify-center">
                  <Image width={250} height={180} src={errorImg}></Image>
                  </div>
                  <div className="flex justify-center ">
                  <button
            className=" text-gold tracking-widest font-body px-4 text-xs mx-auto underline"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button> 
                  </div>
                  
      </div>
   
    )
}

export default Error
